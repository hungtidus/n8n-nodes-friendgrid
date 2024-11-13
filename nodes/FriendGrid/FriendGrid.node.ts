import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FriendGrid',
		name: 'friendGrid',
		icon: 'file:sendgrid.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume SendGrid API',
		defaults: {
			name: 'FriendGrid',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'friendGridApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Space',
						value: 'Space',
					},
					{
						name: 'Node',
						value: 'Node',
					},
					{
						name: 'View',
						value: 'View',
					},
					{
						name: 'Record',
						value: 'Record',
					},
				],
				default: 'Space',
				noDataExpression: true,
				required: true,
				description: 'Resource to consume',
			},
			// Space Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'Space',
						],
					},
				},
				options: [
					{
						name: 'List space',
						value: 'List space',
						description: 'Get the List of Spaces',
						action: 'List space',
					},
				],
				default: 'List space',
				noDataExpression: true,
			},
			// Node Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'Node',
						],
					},
				},
				options: [
					{
						name: 'Search node',
						value: 'Search node',
						description: 'Search Datasheet node',
						action: 'Search node',
					},
				],
				default: 'Search node',
				noDataExpression: true,
			},
			// View Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'View',
						],
					},
				},
				options: [
					{
						name: 'Get Views',
						value: 'Get Views',
						description: 'Get all views of a specified datasheet',
						action: 'Get Views',
					},
				],
				default: 'Get Views',
				noDataExpression: true,
			},
			// Record Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'Record',
						],
					},
				},
				options: [
					{
						name: 'Get Records',
						value: 'Get Records',
						description: 'Get all Records of a specified datasheet',
						action: 'Get Records',
					},
					{
						name: 'Create Record',
						value: 'Create Record',
						description: 'Create a Record of a specified datasheet',
						action: 'Create Record',
					},
					{
						name: 'Update Record',
						value: 'Update Record',
						description: 'Update Record of a specified datasheet',
						action: 'Update Record',
					},
					{
						name: 'Delete Record',
						value: 'Delete Record',
						description: 'Delete Record of a specified datasheet',
						action: 'Delete Record',
					},
				],
				default: 'Get Records',
				noDataExpression: true,
			},
			// Input Parameters
			{
				displayName: 'Space ID',
				name: 'spaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Search node',
						],
						resource: [
							'Node',
						],
					},
				},
				default: '',
				placeholder: 'spcX9P2xUcKst',
				description: 'Input Space ID or Space Name',
			},
			{
				displayName: 'Datasheet ID',
				name: 'DatasheetID',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Get Views',
							'Get Records',
							'Create Record',
							'Update Record',
							'Delete Record',
						],
						resource: [
							'View',
							'Record',
						],
					},
				},
				default: '',
				placeholder: 'dst0vPx2577RdMN9MC',
				description: 'Input Datasheet ID or Datasheet Name',
			},
			{
				displayName: 'View ID',
				name: 'ViewID',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Get Records',
						],
						resource: [
							'Record',
						],
					},
				},
				default: '',
				placeholder: 'viw4mnkqkaqdh',
				description: 'Input View ID or View Name',
			},
			
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Delete Record','Update Record'
						],
						resource: [
							'Record',
						],
					},
				},
				default: '',
				description: 'Comma-separated record ID to delete',
			},
			{
				displayName: 'Records Body',
				name: 'records_body',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Create Record',
							'Update Record',
						],
						resource: [
							'Record',
						],
					},
				},
				default: '',
				description: 'Records data in JSON format',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			// Space Resource
			if (resource === 'Space') {
				if (operation === 'List space') {
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET',
						uri: `https://aitable.ai/fusion/v1/spaces`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
			// Node Resource
			else if (resource === 'Node') {
				if (operation === 'Search node') {
					const spaceid = this.getNodeParameter('spaceId', i) as string;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET',
						uri: `https://aitable.ai/fusion/v2/spaces/${spaceid}/nodes?type=Datasheet&permissions=0,1`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
			// View Resource
			else if (resource === 'View') {
				if (operation === 'Get Views') {
					const datasheetID = this.getNodeParameter('DatasheetID', i) as string;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET',
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/views`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
			// Record Resource
			else if (resource === 'Record') {
				const datasheetID = this.getNodeParameter('DatasheetID', i) as string;

				if (operation === 'Get Records') {
					const viewId = this.getNodeParameter('ViewID', i) as string;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET',
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records?viewId=${viewId}`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Create Record') {
					const records = this.getNodeParameter('records_body', i) as IDataObject;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						body: records,

						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Update Record') {
					const records = this.getNodeParameter('records', i) as IDataObject;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'PATCH',
						body: {
							records: records,
						},
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Delete Record') {
					const recordIds = this.getNodeParameter('recordId', i) as string;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'DELETE',
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records?recordIds=${recordIds}`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
