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
					{
						name: 'Field',
						value: 'Field',
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
						description: 'Search for nodes',
						action: 'Search node',
					},
				],
				default: 'Search node',
				noDataExpression: true,
			},
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
				description: 'The ID of the space',
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
						description: 'Get all views',
						action: 'Get views',
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
						description: 'Get records from view',
						action: 'Get records',
					},
					{
						name: 'Create Record',
						value: 'Create Record',
						description: 'Create a new record',
						action: 'Create record',
					},
					{
						name: 'Update Record',
						value: 'Update Record',
						description: 'Update a record',
						action: 'Update record',
					},
					{
						name: 'Delete Record',
						value: 'Delete Record',
						description: 'Delete a record',
						action: 'Delete record',
					},
				],
				default: 'Get Records',
				noDataExpression: true,
			},
			// Field Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'Field',
						],
					},
				},
				options: [
					{
						name: 'Get Fields',
						value: 'Get Fields',
						description: 'Get all fields from datasheet',
						action: 'Get fields',
					},
					{
						name: 'Create Field',
						value: 'Create Field',
						description: 'Create a new field',
						action: 'Create field',
					},
					{
						name: 'Delete Field',
						value: 'Delete Field',
						description: 'Delete a field',
						action: 'Delete field',
					},
				],
				default: 'Get Fields',
				noDataExpression: true,
			},
			// Common Parameters
			{
				displayName: 'Datasheet ID',
				name: 'DatasheetID',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'View',
							'Record',
							'Field',
						],
					},
				},
				default: '',
				description: 'The ID of the datasheet',
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
				description: 'The ID of the view',
			},
			// Field Parameters
			{
				displayName: 'Space ID',
				name: 'SpaceID',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Create Field',
							'Delete Field',
						],
						resource: [
							'Field',
						],
					},
				},
				default: '',
				description: 'The ID of the space',
			},
			{
				displayName: 'Field Type',
				name: 'fieldType',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Create Field',
						],
						resource: [
							'Field',
						],
					},
				},
				default: '',
				description: 'The type of the field',
			},
			{
				displayName: 'Field Name',
				name: 'fieldName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Create Field',
						],
						resource: [
							'Field',
						],
					},
				},
				default: '',
				description: 'The name of the field',
			},
			{
				displayName: 'Field Properties',
				name: 'fieldProperties',
				type: 'json',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'Create Field',
						],
						resource: [
							'Field',
						],
					},
				},
				default: '{}',
				description: 'Additional properties for the field in JSON format',
			},
			{
				displayName: 'Field ID',
				name: 'fieldId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Delete Field',
						],
						resource: [
							'Field',
						],
					},
				},
				default: '',
				description: 'The ID of the field to delete',
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
					const records = this.getNodeParameter('records_body', i) as IDataObject;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'PATCH',
						body: records,
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Delete Record') {
					const recordId = this.getNodeParameter('recordId', i) as string;
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'DELETE',
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/records/${recordId}`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
			// Field Resource
			else if (resource === 'Field') {
				const datasheetID = this.getNodeParameter('DatasheetID', i) as string;

				if (operation === 'Get Fields') {
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET',
						uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/fields`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Create Field') {
					const spaceId = this.getNodeParameter('SpaceID', i) as string;
					const fieldType = this.getNodeParameter('fieldType', i) as string;
					const fieldName = this.getNodeParameter('fieldName', i) as string;
					const fieldProperties = this.getNodeParameter('fieldProperties', i) as string;

					const payload = {
						type: fieldType,
						name: fieldName,
						property: JSON.parse(fieldProperties),
					};

					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						body: payload,
						uri: `https://aitable.ai/fusion/v1/spaces/${spaceId}/datasheets/${datasheetID}/fields`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
				else if (operation === 'Delete Field') {
					const spaceId = this.getNodeParameter('SpaceID', i) as string;
					const fieldId = this.getNodeParameter('fieldId', i) as string;

					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'DELETE',
						uri: `https://aitable.ai/fusion/v1/spaces/${spaceId}/datasheets/${datasheetID}/fields/${fieldId}`,
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
