/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import {
    AuthInfo,
    ConfigAggregator,
    Connection,
    OrgConfigProperties,
    StateAggregator
} from '@salesforce/core';
import * as fs from 'fs';
import * as path from 'path';

export class OrgUtils {
    public static SF_FOLDER = '.sf';
    public static ORG_NAME: string | undefined = undefined;
    public static OBJECT_INFO_FOLDER = 'objectInfos';
    public static EntityListFileName = 'entity_list.json';
    public static isUserLoggedIn = false;
    public static connection: Connection | undefined = undefined;

    static objectInfoCache = new Map<string, string>();
    static objectInfoLoading = new Set<string>();
    public static entities: string[] = [];

    // Retrieves default organiztion's name.
    public static async getDefaultOrg(): Promise<string> {
        const aggregator = await ConfigAggregator.create();

        await aggregator.reload();

        const currentUserConfig = aggregator.getInfo(OrgConfigProperties.TARGET_ORG);

        if (currentUserConfig && currentUserConfig.value) {
            return Promise.resolve(currentUserConfig.value.toString());
        }
        return Promise.reject('no org');
    }

    // Retrieves username of an authorized org.
    public static async getUsername(org: string): Promise<string> {
        const aggregator = await StateAggregator.getInstance();
        const username = aggregator.aliases.getUsername(org);
        if (username !== null && username !== undefined) {
            return Promise.resolve(username);
        }
        return Promise.reject('no username');
    }

    // Updates the auth state async
    public static async checkAuthStatus(): Promise<boolean> {
        try {
            const orgName = await this.getDefaultOrg();
            await this.getUsername(orgName);
        } catch (error) {
            this.isUserLoggedIn = false;
            return false;
        }
        this.isUserLoggedIn = true;
        return true;
    }

    // Retrieves the Connection which fetches ObjectInfo remotely.
    public static async getConnection(): Promise<Connection | undefined> {
        try {
            const orgName = await this.getDefaultOrg();
            const username = await this.getUsername(orgName);
            const connect = await Connection.create({
                authInfo: await AuthInfo.create({ username })
            });
            this.connection = connect;
            // Fetches entity list once.
            const entityListFile = path.join(this.objectInfoFolderPath(), this.EntityListFileName);
            if (!fs.existsSync(entityListFile)) {
                const objectList = await this.getEntityList(this.connection);
                this.entities = objectList;
                fs.writeFileSync(entityListFile, JSON.stringify(objectList), {
                    mode: 0o666
                });
            } else {
                const entityContent = fs.readFileSync(entityListFile, 'utf8');
                this.entities = JSON.parse(entityContent);
            }
            this.isUserLoggedIn = true;

            return connect;
        } catch (error) {
            this.isUserLoggedIn = false;
            this.connection = undefined;
            return undefined;
        }
    }

    public static async getEntityList(connection: Connection): Promise<string[]> {
        const globalResult = await connection.describeGlobal();
        return globalResult.sobjects.map((sobjettResult) => sobjettResult.name);
    }

    // Retrieves objectInfo folder path, which is '<projectRoot>/.sf/orgName/objectInfos/'
    public static objectInfoFolderPath(): string {
        const orgPath = this.ORG_NAME === undefined ? './' : this.ORG_NAME;
        const projectPath = path.resolve(__dirname, '../../../../../');
        const objectInfoFolder = path.join(
            projectPath,
            OrgUtils.SF_FOLDER,
            orgPath,
            OrgUtils.OBJECT_INFO_FOLDER
        );
        if (!fs.existsSync(objectInfoFolder)) {
            fs.mkdirSync(objectInfoFolder, { recursive: true });
        }
        return objectInfoFolder;
    }

    public static fetchObjectInfoFromDisk(objectApiName: string): string | undefined {
        const objectInfoJsonFile = path.join(this.objectInfoFolderPath(), `${objectApiName}.json`);
        if (!fs.existsSync(objectInfoJsonFile)) {
            return undefined;
        }

        return fs.readFileSync(objectInfoJsonFile, 'utf-8');
    }

    // Acquires ObjectInfo data by first searching in memory, then on disk, and finally over the network.
    public static getObjectInfo(objectApiName: string): string | undefined {
        OrgUtils.checkAuthStatus();
        if (!OrgUtils.isUserLoggedIn) {
            this.objectInfoCache.clear();
            return undefined;
        }
        // Checks mem cache
        let objectInfo = this.objectInfoCache.get(objectApiName);

        if (objectInfo !== undefined) {
            return objectInfo;
        }

        // Checks disk cache
        objectInfo = this.fetchObjectInfoFromDisk(objectApiName);
        if (objectInfo !== undefined) {
            this.objectInfoCache.set(objectApiName, objectInfo);
            return objectInfo;
        }

        // Network loading is going on
        if (this.objectInfoLoading.has(objectApiName)) {
            return undefined;
        }

        this.objectInfoLoading.add(objectApiName);

        // Triggers object info fetching
        OrgUtils.getConnection()
            .then((connection) => {
                if (connection !== undefined && OrgUtils.entities.indexOf(objectApiName) >= 0) {
                    return connection.request(
                        connection.baseUrl() + `/ui-api/object-info/${objectApiName}`
                    );
                }
                return;
            })
            .then((result) => {
                if (result !== undefined) {
                    this.objectInfoResponseCallback(objectApiName, result);
                }
            });

        return undefined;
    }

    private static objectInfoResponseCallback(objectApiName: string, response: unknown) {
        const objectInfoStr = JSON.stringify(response);
        this.objectInfoCache.set(objectApiName, objectInfoStr);
        const objectInfoFile = path.join(this.objectInfoFolderPath(), `${objectApiName}.json`);
        if (fs.existsSync(objectInfoFile)) {
            fs.unlinkSync(objectInfoFile);
        }

        fs.writeFileSync(objectInfoFile, objectInfoStr, { mode: 0o666 });
        this.objectInfoLoading.delete(objectApiName);
    }
}
