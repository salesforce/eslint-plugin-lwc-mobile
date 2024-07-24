import { OrgUtils } from './orgUtils';

export class ObjectUtils {
    static objectInfoCache = new Map<string, string>();
    static objectInfoLoading = new Set<string>();

    private static getObjectInfo(objectApiName: string): string | undefined {
        const objectInfo = this.objectInfoCache.get(objectApiName);

        if (objectInfo !== undefined) {
            return objectInfo;
        }

        // already loading ?
        if (this.objectInfoLoading.has(objectApiName)) {
            return undefined
        }

        this.objectInfoLoading.add(objectApiName);

        // trigger object info fetching
        OrgUtils.getConnection()
            .then((connection) => {
                return connection.request(
                    connection.baseUrl() + `/ui-api/object-info/${objectApiName}`
                );
            })
            .then((result) => {
                const strResult = JSON.stringify(result);
                this.objectInfoCache.set(objectApiName, strResult);
                this.objectInfoLoading.delete(objectApiName);
            });

        return undefined;
    }

    public static isValidField(objectApiName: string, fieldName: string): boolean {
        const objectInfoStr = this.getObjectInfo(objectApiName);
        if (objectInfoStr === undefined) { 
            return true;
        }
        const objectInfo = JSON.parse(objectInfoStr);
        return objectInfo['fields'][fieldName] !== undefined;
    }

    public static isValidFieldMock(objectApiName: string, fieldName: string): boolean {
        console.log('ObjectInfo apiName: ' + objectApiName + '; fieldName: ' + fieldName);
        if (fieldName.toLowerCase() === 'nane') {
            return false;
        }
        return true;
    }

    public static getFieldType(
        objectApiName: string,
        fieldName: string
    ): string | undefined {
        const objectInfoStr = this.getObjectInfo(objectApiName);
        if (objectInfoStr === undefined) {
            return undefined;
        }
        const objectInfo = JSON.parse(objectInfoStr);

        if (objectInfo['fields'][fieldName] !== undefined) {
            return objectInfo['fields'][fieldName]['dataType']
        } else {
            return undefined;
        }
    }
}
