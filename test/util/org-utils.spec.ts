import { ConfigAggregator, Connection, StateAggregator } from '@salesforce/core';
import { OrgUtils } from '../../src/util/org-utils';
import fs from 'fs';
import path from 'path';
import AccountObjectInfo from '../mockData/object-Account.json';
jest.mock('@salesforce/core', () => {
    return {
        ConfigAggregator: {
            create: jest.fn()
        },
        OrgConfigProperties: {
            TARGET_ORG: 'target-org'
        },
        StateAggregator: {
            getInstance: jest.fn()
        },
        Connection: {
            create: jest.fn()
        },
        AuthInfo: {
            create: jest.fn()
        }
    };
});

const flushPromises = () => new Promise(setImmediate);

describe('getDefaultOrg', () => {
    let mockConfigAggregator: any;

    beforeEach(() => {
        jest.resetAllMocks();
        mockConfigAggregator = {
            reload: jest.fn(),
            getInfo: jest.fn()
        };

        (ConfigAggregator.create as jest.Mock).mockResolvedValue(mockConfigAggregator);
    });

    it('should return mock org', async () => {
        (mockConfigAggregator.getInfo as jest.Mock).mockReturnValue({
            value: 'mock org'
        });
        const org = await OrgUtils.getDefaultOrg();
        expect(org).toBe('mock org');
    });

    it('should reject with "no org" when config value is undefined', async () => {
        (mockConfigAggregator.getInfo as jest.Mock).mockReturnValue({});

        await expect(OrgUtils.getDefaultOrg()).rejects.toEqual('no org');
    });
});

describe('getUserName', () => {
    let mockStateAggregator: any;

    beforeEach(() => {
        jest.resetAllMocks();
        mockStateAggregator = {
            aliases: {
                getUsername: jest.fn()
            }
        };
        (StateAggregator.getInstance as jest.Mock).mockResolvedValue(mockStateAggregator);
    });

    it('should return user name when alias has username configured ', async () => {
        (mockStateAggregator.aliases.getUsername as jest.Mock).mockReturnValue('mock user');
        const username = await OrgUtils.getUsername('mock org');
        expect(username).toBe('mock user');
    });

    it('should reject with "no username" if alias has no username configured', async () => {
        (mockStateAggregator.aliases.getUsername as jest.Mock).mockReturnValue(undefined);
        await expect(OrgUtils.getUsername('mock org')).rejects.toEqual('no username');
    });
});

describe('getConnection', () => {
    let mockConnection: any;

    let entityListSpy: any;

    let orgSpy: any;
    let userSpy: any;
    let folderPathSpy: any;
    let fsWriteSpy: any;
    let fsExistSpy: any;

    beforeEach(() => {
        orgSpy = jest.spyOn(OrgUtils, 'getDefaultOrg');

        userSpy = jest.spyOn(OrgUtils, 'getUsername');

        entityListSpy = jest.spyOn(OrgUtils, 'getEntityList');

        folderPathSpy = jest.spyOn(OrgUtils, 'objectInfoFolderPath');

        fsWriteSpy = jest.spyOn(fs, 'writeFileSync');

        fsExistSpy = jest.spyOn(fs, 'existsSync');

        mockConnection = {
            request: jest.fn(),
            baseUrl: jest.fn()
        };

        orgSpy.mockResolvedValue('mockOrg');
        userSpy.mockResolvedValue('mockUser');
        entityListSpy.mockResolvedValue(['Account', 'User']);
        folderPathSpy.mockReturnValue('/webdev/lwc_mobile/.sf/mockOrg/objectInfos');
        fsWriteSpy.mockImplementation(() => {});
        // entity list does not exist in disk at the beginging
        fsExistSpy.mockReturnValueOnce(false).mockReturnValueOnce(true);
        (Connection.create as jest.Mock).mockResolvedValue(mockConnection);
        OrgUtils.entities = [];
    });

    afterEach(() => {
        orgSpy.mockRestore();
        userSpy.mockRestore();
        entityListSpy.mockRestore();
        folderPathSpy.mockRestore();
        fsWriteSpy.mockRestore();
        fsExistSpy.mockRestore();
    });
    it('should return connection', async () => {
        const connection = await OrgUtils.getConnection();
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            '/webdev/lwc_mobile/.sf/mockOrg/objectInfos/entity_list.json',
            '["Account","User"]',
            { mode: 0o666 }
        );

        expect(connection).toBe(mockConnection);
        expect(OrgUtils.entities).toEqual(['Account', 'User']);
    });

    it('should not generate entity list if it is in cache', async () => {
        await OrgUtils.getConnection();
        await OrgUtils.getConnection();
        expect(entityListSpy).toHaveBeenCalledTimes(1);
    });
});

describe('checkAuthState', () => {
    let orgSpy: any;
    beforeEach(() => {
        orgSpy = jest.spyOn(OrgUtils, 'getDefaultOrg');
        orgSpy.mockResolvedValue('mockOrg');
    });

    afterEach(() => {
        orgSpy.mockRestore();
    });

    it('should be true if user name exists', async () => {
        const userSpy = jest.spyOn(OrgUtils, 'getUsername');
        userSpy.mockResolvedValue('mockUser');
        const status = await OrgUtils.checkAuthStatus();
        expect(status).toBe(true);
    });

    it('should be false if "getUserName" throws an error', async () => {
        const userSpy = jest.spyOn(OrgUtils, 'getUsername');
        userSpy.mockRejectedValue('no user');
        const status = await OrgUtils.checkAuthStatus();
        expect(status).toBe(false);
    });
});

describe('getEntityList', () => {
    let mockConnection: any;

    beforeEach(() => {
        mockConnection = {
            describeGlobal: jest.fn()
        };
    });

    it('should return list of entities', async () => {
        (mockConnection.describeGlobal as jest.Mock).mockResolvedValue({
            sobjects: [{ name: 'Account' }, { name: 'User' }]
        });
        const entities = await OrgUtils.getEntityList(mockConnection);
        expect(entities).toEqual(['Account', 'User']);
    });
});

describe('objectInfoFolderPath', () => {
    let pathSpy: any;
    let fsExistSpy: any;

    beforeEach(() => {
        pathSpy = jest.spyOn(path, 'resolve');
        fsExistSpy = jest.spyOn(fs, 'existsSync');
    });
    afterEach(() => {
        pathSpy.mockRestore();
        fsExistSpy.mockRestore();
    });
    it('should return correct object info path', () => {
        OrgUtils.ORG_NAME = 'mockOrg';

        pathSpy.mockReturnValue('/webdev/test');
        fsExistSpy.mockReturnValue(true);

        const objectInfoFolderPath = OrgUtils.objectInfoFolderPath();
        expect(objectInfoFolderPath).toBe('/webdev/test/.sf/mockOrg/objectInfos');
    });
});

describe('fetchObjectInfoFromDisk', () => {
    let folderPathSpy: any;
    let fsExistSpy: any;
    let readSpy: any;

    beforeEach(() => {
        folderPathSpy = jest.spyOn(OrgUtils, 'objectInfoFolderPath');
        folderPathSpy.mockReturnValue('/webdev/lwc_mobile/.sf/mockOrg/objectInfos');
        fsExistSpy = jest.spyOn(fs, 'existsSync');
        readSpy = jest.spyOn(fs, 'readFileSync');
    });
    afterEach(() => {
        folderPathSpy.mockRestore();
        fsExistSpy.mockRestore();
        readSpy.mockRestore();
    });

    it('should return correct object info path', () => {
        fsExistSpy.mockReturnValueOnce(true);
        readSpy.mockReturnValue(JSON.stringify(AccountObjectInfo));
        const objectInfo = OrgUtils.fetchObjectInfoFromDisk('Account');
        expect(objectInfo).toBe(JSON.stringify(AccountObjectInfo));
    });
});

describe('getObjectInfo', () => {
    let orgSpy: any;
    let userSpy: any;

    let mockConnection: any;

    beforeEach(() => {
        orgSpy = jest.spyOn(OrgUtils, 'getDefaultOrg');

        userSpy = jest.spyOn(OrgUtils, 'getUsername');

        orgSpy.mockResolvedValue('mockOrg');
        userSpy.mockResolvedValue('mockUser');
    });

    afterEach(() => {
        orgSpy.mockRestore();
        userSpy.mockRestore();
    });

    xit('should send request over network if objectInfo is not cached', async () => {
        OrgUtils.isUserLoggedIn = false;
        mockConnection = {
            request: jest.fn(),
            baseUrl: jest.fn()
        };

        (Connection.create as jest.Mock).mockResolvedValue(mockConnection);
        const diskCacheSpy = jest.spyOn(OrgUtils, 'fetchObjectInfoFromDisk');
        diskCacheSpy.mockReturnValue(undefined);

        (mockConnection.request as jest.Mock).mockResolvedValue(AccountObjectInfo);

        const fsWriteSpy = jest.spyOn(fs, 'writeFileSync');
        fsWriteSpy.mockImplementation(() => {});
        const fsExistSpy = jest.spyOn(fs, 'existsSync');
        fsExistSpy.mockReturnValue(false);
        const entityListSpy = jest.spyOn(OrgUtils, 'getEntityList');
        const folderPathSpy = jest.spyOn(OrgUtils, 'objectInfoFolderPath');
        entityListSpy.mockResolvedValue(['Account', 'User']);
        folderPathSpy.mockReturnValue('/webdev/lwc_mobile/.sf/mockOrg/objectInfos');

        // Auth state is logged out, return with undefined.
        OrgUtils.getObjectInfo('Account');

        await flushPromises();

        // Auth state is logged in, check disk cache, fetch ObjectInfo over network, return undefined
        let objectInfo = OrgUtils.getObjectInfo('Account');
        expect(objectInfo).toBeUndefined();

        // Auth state is logged in, check disk cache, verify ObjectInfo loading is going on, return undefined
        objectInfo = OrgUtils.getObjectInfo('Account');
        expect(objectInfo).toBeUndefined();

        await flushPromises();

        //Connection comes back and requests across the network
        objectInfo = OrgUtils.getObjectInfo('Account');
        expect(objectInfo).toBe(JSON.stringify(AccountObjectInfo));

        fsWriteSpy.mockRestore();
        fsExistSpy.mockRestore();
        diskCacheSpy.mockRestore();
        entityListSpy.mockRestore();
        folderPathSpy.mockRestore();
    });

    it('should return objectInfo is it is in cache', async () => {
        OrgUtils.isUserLoggedIn = false;
        const diskCacheSpy = jest.spyOn(OrgUtils, 'fetchObjectInfoFromDisk');
        diskCacheSpy.mockReturnValue(JSON.stringify(AccountObjectInfo));
        let accountObjectInfo = OrgUtils.getObjectInfo('Account');
        // First time, the auth status is logout.
        expect(accountObjectInfo).toBeUndefined();
        //  After asynchrous code finish execution, the auth status is logged in.
        await flushPromises();
        // First check memory, then load cache is disk into memory and return objectInfo
        accountObjectInfo = OrgUtils.getObjectInfo('Account');
        expect(accountObjectInfo).toBeDefined();
        expect(OrgUtils.objectInfoCache.size).toBe(1);
        diskCacheSpy.mockRestore();
    });
});
