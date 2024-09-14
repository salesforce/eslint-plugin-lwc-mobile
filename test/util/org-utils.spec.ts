import { ConfigAggregator, StateAggregator } from '@salesforce/core';
import { OrgUtils } from '../../src/util/org-utils';
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
        }
    };
});

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
