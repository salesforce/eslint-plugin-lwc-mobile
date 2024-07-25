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
            return undefined;
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

    public static getFields(objectApiName: string): Set<string> | undefined {
        const objectInfoStr = this.getObjectInfo(objectApiName);
        if (objectInfoStr === undefined) {
            return undefined;
        }

        const objectInfo = JSON.parse(objectInfoStr);
        const fields = objectInfo['fields'];
        const fieldSet = new Set<string>();
        for (const [fieldName] of Object.entries(fields)) {
            fieldSet.add(fieldName);
        }
        return fieldSet;
    }

    public static isValidFieldMock(objectApiName: string, fieldName: string): boolean {
        console.log('ObjectInfo apiName: ' + objectApiName + '; fieldName: ' + fieldName);
        if (fieldName.toLowerCase() === 'nane') {
            return false;
        }
        return true;
    }

    public static getFieldType(objectApiName: string, fieldName: string): string | undefined {
        const objectInfoStr = this.getObjectInfo(objectApiName);
        if (objectInfoStr === undefined) {
            return undefined;
        }
        const objectInfo = JSON.parse(objectInfoStr);

        if (objectInfo['fields'][fieldName] !== undefined) {
            return objectInfo['fields'][fieldName]['dataType'];
        } else {
            return undefined;
        }
    }

    public static findCloseFieldNames(objectApiName: string, randomName: string): Array<string> {
        const fields = this.getFields(objectApiName);
        if (fields === undefined) {
            return [];
        }

        const queue: { field: undefined | string; score: number }[] = [
            { field: undefined, score: Number.MAX_SAFE_INTEGER },
            { field: undefined, score: Number.MAX_SAFE_INTEGER },
            { field: undefined, score: Number.MAX_SAFE_INTEGER }
        ];

        for (const field of fields) {
            const score = this.levenshteinDistance(field, randomName);
            if (score < queue[2].score) {
                queue.push({ field, score });
                queue.sort((a, b) => a.score - b.score);
                queue.pop();
            }
        }

        return queue
            .filter((elem) => elem.field !== undefined)
            .map((elem) => elem.field) as Array<string>;
    }

    public static levenshteinDistance(str1: string, str2: string): number {
        const m = str1.length;
        const n = str2.length;

        const dp = Array(m + 1)
            .fill(0)
            .map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }

        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
            }
        }

        return dp[m][n];
    }
}
