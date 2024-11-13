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
		// Basic node details will go here
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
			// Resources and operations will go here
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
						name: 'Field',
						value: 'Field',
					},
					{
						name: 'Record',
						value: 'Record',
					},

				],
				default: 'Space',
				noDataExpression: true,
				required: true,
				description: 'Get the List of Spaces',
			},
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
			//operation Field
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
						description: 'Get all fields of a specified datasheet',
						action: 'Get Fields',
					},
					{
						name: 'Create Field',
						value: 'Create Field',
						description: 'Create all field of a specified datasheet',
						action: 'Create Field',
					},
					{
						name: 'Delete Field',
						value: 'Delete Field',
						description: 'Delete field of a specified datasheet',
						action: 'Delete Field',
					},

				],
				default: 'Get Fields',
				noDataExpression: true,
			},
			///////////end operation field

			//operation Record
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
						action: 'Update Record'
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

			//end operation Record


			// begin test
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
			{
				displayName: 'Space ID',
				name: 'spaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'Search node','Create Field','Delete Field',
						],
						resource: [
							'Node','Field',
						],
					},
				},
				default: '',
				placeholder: 'spcX9P2xUcKst',
				description: 'Input Space ID or Space Name',
			},
// <---- begin input Datasheet ID
{
	displayName: 'Datasheet ID',
	name: 'DatasheetID',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			operation: [
				'Get Views',
				'Get Records','Create Record','Update Record','Delete Record',
				'Get Fields','Create Field','Delete Field',
			],
			resource: [
				'View','Record','Field'
			],
		},
	},
	default: '',
	placeholder: 'dst0vPx2577RdMN9MC',
	description: 'Input Datasheet ID or Datasheet Name',
},
// End input Datasheet ID ---->

// <---- begin input ViewID
{
	displayName: 'ViewID',
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
// End input ViewID ---->

	

			//operation View
			{
				displayName: 'View',
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
	//end operation View



			/*	{
					displayName: 'Additional Fields',
					name: 'additionalFields',
					type: 'collection',
					placeholder: 'Add Field',
					default: {},
					displayOptions: {
						show: {
							resource: [
								'Space',
							],
							operation: [
								'create',
							],
						},
					},
					options: [
						{
							displayName: 'First Name',
							name: 'firstName',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Last Name',
							name: 'lastName',
							type: 'string',
							default: '',
						},
					],
				},*/
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a Space
		for (let i = 0; i < items.length; i++) {
			if (resource === 'Space') {
				if (operation === 'List space') {
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET', //no body				
						uri: `https://aitable.ai/fusion/v1/spaces`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			} else if (resource === 'Node') {
				if (operation === 'Search node') {
					// Get SpaceID input
					const spaceid = this.getNodeParameter('spaceId', i) as string;
					// Get additional fields input
					//const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const data: IDataObject = {
						spaceid,
					};

					Object.assign(data);

					// Make HTTP request according to https://developers.aitable.ai/api/search-nodes
					const options: OptionsWithUri = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'GET', // Sử dụng GET nếu đang tìm kiếm
						//  body: data, // Chuyển body sang data nếu cần thiết
						uri: `https://aitable.ai/fusion/v2/spaces/${spaceid}/nodes?type=Datasheet&permissions=0,1`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
					returnData.push(responseData);
				}
			}
			// <---- begin action Get Views
	else if (resource === 'View') {
		if (operation === 'Get Views') {
			// Get datasheetID input
			const datasheetID = this.getNodeParameter('DatasheetID', i) as string;
			// Get additional fields input
			//const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			const data: IDataObject = {
				datasheetID,
			};
			Object.assign(data);
			// Make HTTP request according to https://developers.aitable.ai/api/get-views/
			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
				},
				method: 'GET', // Sử dụng GET nếu đang tìm kiếm
				//  body: data, // Chuyển body sang data nếu cần thiết
				uri: `https://aitable.ai/fusion/v1/datasheets/${datasheetID}/views`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
			returnData.push(responseData);
		}
	}
// End action Get Views ---->
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}