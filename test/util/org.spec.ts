describe('testImport', () => {
    it('sample code', async () => {
        expect(1).toBe(1);
    });
});

// describe('getDefaultOrg', () => {
//     let mockConfigAggregator: any;

//     beforeEach(() => {
//         jest.resetAllMocks();
//         mockConfigAggregator = {
//             reload: jest.fn(),
//             getInfo: jest.fn()
//         };

//         (ConfigAggregator.create as jest.Mock).mockResolvedValue(mockConfigAggregator);
//     });

//     xit('should return mock org', async () => {
//         (mockConfigAggregator.getInfo as jest.Mock).mockReturnValue({
//             value: 'mock org'
//         });
//         const org = await OrgUtils.getDefaultOrg();
//         expect(org).toBe('mock org');
//     });

//     xit('should reject with "no org" when config value is undefined', async () => {
//         (mockConfigAggregator.getInfo as jest.Mock).mockReturnValue({});

//         await expect(OrgUtils.getDefaultOrg()).rejects.toEqual('no org');
//     });
// });

// describe('getUserName', () => {
//     let mockStateAggregator: any;

//     beforeEach(() => {
//         jest.resetAllMocks();
//         mockStateAggregator = {
//             aliases: {
//                 getUsername: jest.fn()
//             }
//         };
//         (StateAggregator.getInstance as jest.Mock).mockResolvedValue(mockStateAggregator);
//     });

//     xit('should return user name when alias has username configured ', async () => {
//         (mockStateAggregator.aliases.getUsername as jest.Mock).mockReturnValue('mock user');
//         const username = await OrgUtils.getUsername('mock org');
//         expect(username).toBe('mock user');
//     });

//     xit('should reject with "no username" if alias has no username configured', async () => {
//         (mockStateAggregator.aliases.getUsername as jest.Mock).mockReturnValue(undefined);
//         await expect(OrgUtils.getUsername('mock org')).rejects.toEqual('no username');
//     });
// });

// describe('getConnection', () => {
//     let mockConnection: any;

//     let entityListSpy: any;

//     let orgSpy: any;
//     let userSpy: any;
//     let folderPathSpy: any;
//     let fsWriteSpy: any;
//     let fsExistSpy: any;

//     beforeEach(() => {
//         orgSpy = jest.spyOn(OrgUtils, 'getDefaultOrg');

//         userSpy = jest.spyOn(OrgUtils, 'getUsername');

//         entityListSpy = jest.spyOn(OrgUtils, 'getEntityList');

//         folderPathSpy = jest.spyOn(OrgUtils, 'objectInfoFolderPath');

//         fsWriteSpy = jest.spyOn(fs, 'writeFileSync');

//         fsExistSpy = jest.spyOn(fs, 'existsSync');

//         mockConnection = {
//             request: jest.fn(),
//             baseUrl: jest.fn()
//         };

//         orgSpy.mockResolvedValue('mockOrg');
//         userSpy.mockResolvedValue('mockUser');
//         entityListSpy.mockResolvedValue(['Account', 'User']);
//         folderPathSpy.mockReturnValue('/webdev/lwc_mobile/.sf/mockOrg/objectInfos');
//         fsWriteSpy.mockImplementation(() => {});
//         // entity list does not exist in disk at the beginging
//         fsExistSpy.mockReturnValueOnce(false).mockReturnValueOnce(true);
//         (Connection.create as jest.Mock).mockResolvedValue(mockConnection);
//         OrgUtils.entities = [];
//     });

//     afterEach(() => {
//         orgSpy.mockRestore();
//         userSpy.mockRestore();
//         entityListSpy.mockRestore();
//         folderPathSpy.mockRestore();
//         fsWriteSpy.mockRestore();
//         fsExistSpy.mockRestore();
//     });
//     xit('should return connection', async () => {
//         const connection = await OrgUtils.getConnection();
//         expect(fs.writeFileSync).toHaveBeenCalledWith(
//             '/webdev/lwc_mobile/.sf/mockOrg/objectInfos/entity_list.json',
//             '["Account","User"]',
//             { mode: 0o666 }
//         );

//         expect(connection).toBe(mockConnection);
//         expect(OrgUtils.entities).toEqual(['Account', 'User']);
//     });

//     xit('should not generate entity list if it is in cache', async () => {
//         await OrgUtils.getConnection();
//         await OrgUtils.getConnection();
//         expect(entityListSpy).toHaveBeenCalledTimes(1);
//     });
// });

// describe('checkAuthState', () => {
//     let orgSpy: any;
//     beforeEach(() => {
//         orgSpy = jest.spyOn(OrgUtils, 'getDefaultOrg');
//         orgSpy.mockResolvedValue('mockOrg');
//     });

//     afterEach(() => {
//         orgSpy.mockRestore();
//     });

//     xit('should be true if user name exists', async () => {
//         const userSpy = jest.spyOn(OrgUtils, 'getUsername');
//         userSpy.mockResolvedValue('mockUser');
//         const status = await OrgUtils.checkAuthStatus();
//         expect(status).toBe(true);
//     });

//     xit('should be false if "getUserName" throws an error', async () => {
//         const userSpy = jest.spyOn(OrgUtils, 'getUsername');
//         userSpy.mockRejectedValue('no user');
//         const status = await OrgUtils.checkAuthStatus();
//         expect(status).toBe(false);
//     });
// });
