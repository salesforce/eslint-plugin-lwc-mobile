import { OrgUtils } from './orgUtils';

export class ObjectUtils {
    static objectInfoCache = new Map<string, string>();

    private static async getObjectInfo(objectApiName: string): Promise<string> {
        const objectInfo = this.objectInfoCache.get(objectApiName);

        if (objectInfo !== undefined) {
            return Promise.resolve(objectInfo);
        }
        return OrgUtils.getConnection()
            .then((connection) => {
                return connection.request(
                    connection.baseUrl() + `/ui-api/object-info/${objectApiName}`
                );
            })
            .then((result) => {
                const strResult = JSON.stringify(result);
                console.log(`account info: ${objectApiName}: ` + strResult);
                this.objectInfoCache.set(objectApiName, strResult);
                return strResult;
            });
    }

    public static async isValidField(objectApiName: string, fieldName: string): Promise<boolean> {
        const objectInfoStr = await this.getObjectInfo(objectApiName);
        const objectInfo = JSON.parse(objectInfoStr);

        return Promise.resolve(objectInfo['fields'][fieldName] !== undefined);
    }

    public static isValidFieldMock(objectApiName: string, fieldName: string): boolean {
        console.log('ObjectInfo apiName: ' + objectApiName + '; fieldName: ' + fieldName);
        if (fieldName.toLowerCase() === 'nane') {
            return false;
        }
        return true;
    }

    public static async getFieldType(
        objectApiName: string,
        fieldName: string
    ): Promise<string | undefined> {
        const objectInfoStr = await this.getObjectInfo(objectApiName);
        const objectInfo = JSON.parse(objectInfoStr);

        if (objectInfo['fields'][fieldName] !== undefined) {
            return Promise.resolve(objectInfo['fields'][fieldName]['dataType']);
        } else {
            return Promise.resolve(undefined);
        }
    }
}
