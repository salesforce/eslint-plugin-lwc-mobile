import { Org } from "@salesforce/core";
import { OrgUtils } from "./orgUtils";

export class ObjectUtils {

    static objectInfoCache = new Map<string, string>();

    private static async getObjectInfo(objectApiName: string): Promise<string> {
        var objectInfo = this.objectInfoCache.get(objectApiName);
        if (objectInfo === undefined) {
            const connection = await OrgUtils.getConnection();
            
        } 
    }

    public static async isValidField(objectApiName: string, fieldName: string): Promise<boolean> {
        


        const currentUserConfig = aggregator.getInfo(
            OrgConfigProperties.TARGET_ORG
        );

        if (currentUserConfig && currentUserConfig.value) {
            return Promise.resolve(currentUserConfig.value.toString());
        }
        return Promise.reject('no user');
    }

    public static async getFieldType(objectApiName: string, fieldName: string): Promise<string> {
        const aggregator = await ConfigAggregator.create();

        // When VSCode re-opens itself for a new project aggregator needs a
        // forced reload in order to get the currently authorized user.
        await aggregator.reload();

        const currentUserConfig = aggregator.getInfo(
            OrgConfigProperties.TARGET_ORG
        );

        if (currentUserConfig && currentUserConfig.value) {
            return Promise.resolve(currentUserConfig.value.toString());
        }
        return Promise.reject('no user');
    }
 
}