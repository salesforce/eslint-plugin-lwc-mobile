/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { AuthInfo, ConfigAggregator, Connection, OrgConfigProperties, StateAggregator } from '@salesforce/core';

export interface SObject {
    apiName: string;
    label: string;
    labelPlural: string;
}

export interface Field {
    apiName: string;
    label: string;
    type: string;
}

export interface CompactLayoutFieldComponents {
    value: string;
}

export interface CompactLayoutField {
    editableForNew: boolean;
    editableForUpdate: boolean;
    label: string;
    layoutComponents: CompactLayoutFieldComponents[];
}

export type SObjectCompactLayoutMapping = {
    compactLayoutId: string | null;
    compactLayoutName: string;
    recordTypeId: string;
};

export type SObjectCompactLayouts = {
    defaultCompactLayoutId: string | null;
    recordTypeCompactLayoutMappings: SObjectCompactLayoutMapping[];
};

export type SObjectCompactLayout = {
    fieldItems: CompactLayoutField[];
};

export class OrgUtils {

    public static async getDefaultUser(): Promise<string> {
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

    public static async getUsername(alias: string): Promise<string> {
        const aggregator = await StateAggregator.getInstance();
        const username = aggregator.aliases.getUsername(alias);
        if (username !== null && username !== undefined) {
            return Promise.resolve(username);
        }
        return Promise.reject("no username found");
    }

    public static async getConnection(): Promise<Connection> {
        const alias = await this.getDefaultUser();
        const username = await this.getUsername(alias);
        const connection = await Connection.create({
            authInfo: await AuthInfo.create({username})
        });
        return connection;
    }
}
