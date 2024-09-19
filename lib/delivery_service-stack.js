"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const events = require("aws-cdk-lib/aws-events");
const _dynamodb = require("aws-cdk-lib/aws-dynamodb");
class DeliveryServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create our dynamodb table
        const deliveryTable = new _dynamodb.Table(this, "DeliveryTable", {
            tableName: "deliveryTable",
            partitionKey: {
                name: "PK",
                type: _dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: "SK",
                type: _dynamodb.AttributeType.STRING,
            },
            billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST,
            stream: _dynamodb.StreamViewType.NEW_IMAGE,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        //create our API
        const api = new appsync.GraphqlApi(this, "DeliveryAPI", {
            name: "DeliveryAPI",
            definition: appsync.Definition.fromFile("./schema/schema.graphql"),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                },
            },
            logConfig: {
                fieldLogLevel: appsync.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const deliveryDatasource = api.addDynamoDbDataSource("deliveryDatasource", deliveryTable);
        const eventBus = events.EventBus.fromEventBusArn(this, "eventBus", "arn:aws:events:us-east-1:132260253285:event-bus/PackageEventBus");
        // const lambdaDatasource = api.addDynamoDbDataSource("DeliveryDatasource", deliveryTable)
        const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
        const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
            api: api,
            name: 'PutEvent',
            dataSource: eventBridgeDs,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset('./resolvers/delivery/putEvent.js'),
        });
        // const packageDelivered = new appsync.AppsyncFunction(
        //   this,
        //   "packageDeliveredFunction",
        //   {
        //     api,
        //     dataSource: deliveryDatasource,
        //     name: "packageDeliveredFunction",
        //     code: appsync.Code.fromAsset("./resolvers/package/packageDelivered.js"),
        //     runtime: appsync.FunctionRuntime.JS_1_0_0,
        //   }
        // );
        new appsync.Resolver(this, "packageDeliveredResolver", {
            api,
            typeName: "Mutation",
            fieldName: "packageDelivered",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [putEvent],
        });
        // Moved to the package service
        // const packageApi = appsync.GraphqlApi.fromGraphqlApiAttributes(this, 'ExistingApi', {
        //   graphqlApiId: 'YOUR_EXISTING_API_ID',  // Replace with your AppSync API ID
        // });
        // const rule = new events.Rule(this, "package-delivered", {
        //   eventBus: events.EventBus.fromEventBusArn(this, "", "arn:aws:events:us-east-1:132260253285:event-bus/PackageEventBus"),
        //   eventPattern: {
        //     detailType: events.Match.exactString("package.delivered"),
        //     source: ["delivery.api"],
        //   },
        // });
        // rule.addTarget(new _target.AppSync(packageApi, {
        //   graphQLOperation: 'mutation Publish($message: String!){ publish(message: $message) { message } }',
        //   variables: events.RuleTargetInput.fromObject({
        //     message: 'hello world',
        //   }),
        // }));
    }
}
exports.DeliveryServiceStack = DeliveryServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsaXZlcnlfc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlbGl2ZXJ5X3NlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFDakQsc0RBQXFEO0FBSXJELE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw0QkFBNEI7UUFFNUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0QsU0FBUyxFQUFFLGVBQWU7WUFDMUIsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNyQztZQUNELFdBQVcsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLGVBQWU7WUFDbEQsTUFBTSxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsU0FBUztZQUMxQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQTtRQUVGLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN0RCxJQUFJLEVBQUUsYUFBYTtZQUNuQixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUM7WUFDbEUsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTztpQkFDckQ7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHO2FBQ3pDO1lBQ0QsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUUsYUFBYSxDQUFDLENBQUE7UUFFekYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpRUFBaUUsQ0FBQyxDQUFBO1FBRXJJLDBGQUEwRjtRQUMxRixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzdELEdBQUcsRUFBRSxHQUFHO1lBQ1IsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0NBQWtDLENBQUM7U0FDakUsQ0FBQyxDQUFDO1FBR0gsd0RBQXdEO1FBQ3hELFVBQVU7UUFDVixnQ0FBZ0M7UUFDaEMsTUFBTTtRQUNOLFdBQVc7UUFDWCxzQ0FBc0M7UUFDdEMsd0NBQXdDO1FBQ3hDLCtFQUErRTtRQUMvRSxpREFBaUQ7UUFDakQsTUFBTTtRQUNOLEtBQUs7UUFDTCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ3JELEdBQUc7WUFDSCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsa0JBQWtCO1lBQzdCLE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7WUFDekMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUFDO1lBQy9ELGNBQWMsRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUMzQixDQUFDLENBQUM7UUFFSCwrQkFBK0I7UUFDL0Isd0ZBQXdGO1FBQ3hGLCtFQUErRTtRQUMvRSxNQUFNO1FBRU4sNERBQTREO1FBQzVELDRIQUE0SDtRQUM1SCxvQkFBb0I7UUFDcEIsaUVBQWlFO1FBQ2pFLGdDQUFnQztRQUNoQyxPQUFPO1FBQ1AsTUFBTTtRQUdOLG1EQUFtRDtRQUNuRCx1R0FBdUc7UUFDdkcsbURBQW1EO1FBQ25ELDhCQUE4QjtRQUM5QixRQUFRO1FBQ1IsT0FBTztJQUNULENBQUM7Q0FDRjtBQTVGRCxvREE0RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBwc3luY1wiO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBfZHluYW1vZGIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiXG5pbXBvcnQgKiBhcyBfbG1hYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCJcbmltcG9ydCAqIGFzIF90YXJnZXQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0c1wiO1xuXG5leHBvcnQgY2xhc3MgRGVsaXZlcnlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBDcmVhdGUgb3VyIGR5bmFtb2RiIHRhYmxlXG5cbiAgICBjb25zdCBkZWxpdmVyeVRhYmxlID0gbmV3IF9keW5hbW9kYi5UYWJsZSh0aGlzLCBcIkRlbGl2ZXJ5VGFibGVcIiwge1xuICAgICAgdGFibGVOYW1lOiBcImRlbGl2ZXJ5VGFibGVcIixcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiBcIlBLXCIsXG4gICAgICAgIHR5cGU6IF9keW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiB7XG4gICAgICAgIG5hbWU6IFwiU0tcIixcbiAgICAgICAgdHlwZTogX2R5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgfSxcbiAgICAgIGJpbGxpbmdNb2RlOiBfZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgc3RyZWFtOiBfZHluYW1vZGIuU3RyZWFtVmlld1R5cGUuTkVXX0lNQUdFLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KVxuXG4gICAgLy9jcmVhdGUgb3VyIEFQSVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgXCJEZWxpdmVyeUFQSVwiLCB7XG4gICAgICBuYW1lOiBcIkRlbGl2ZXJ5QVBJXCIsXG4gICAgICBkZWZpbml0aW9uOiBhcHBzeW5jLkRlZmluaXRpb24uZnJvbUZpbGUoXCIuL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbFwiKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxvZ0NvbmZpZzoge1xuICAgICAgICBmaWVsZExvZ0xldmVsOiBhcHBzeW5jLkZpZWxkTG9nTGV2ZWwuQUxMLFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVsaXZlcnlEYXRhc291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcImRlbGl2ZXJ5RGF0YXNvdXJjZVwiLCBkZWxpdmVyeVRhYmxlKVxuXG4gICAgY29uc3QgZXZlbnRCdXMgPSBldmVudHMuRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHRoaXMsIFwiZXZlbnRCdXNcIiwgXCJhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTMyMjYwMjUzMjg1OmV2ZW50LWJ1cy9QYWNrYWdlRXZlbnRCdXNcIilcblxuICAgIC8vIGNvbnN0IGxhbWJkYURhdGFzb3VyY2UgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFwiRGVsaXZlcnlEYXRhc291cmNlXCIsIGRlbGl2ZXJ5VGFibGUpXG4gICAgY29uc3QgZXZlbnRCcmlkZ2VEcyA9IGFwaS5hZGRFdmVudEJyaWRnZURhdGFTb3VyY2UoJ0V2ZW50QnJpZGdlJywgZXZlbnRCdXMpO1xuICAgIGNvbnN0IHB1dEV2ZW50ID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsICdQdXRFdmVudCcsIHtcbiAgICAgIGFwaTogYXBpLFxuICAgICAgbmFtZTogJ1B1dEV2ZW50JyxcbiAgICAgIGRhdGFTb3VyY2U6IGV2ZW50QnJpZGdlRHMsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoJy4vcmVzb2x2ZXJzL2RlbGl2ZXJ5L3B1dEV2ZW50LmpzJyksXG4gICAgfSk7XG5cblxuICAgIC8vIGNvbnN0IHBhY2thZ2VEZWxpdmVyZWQgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgLy8gICB0aGlzLFxuICAgIC8vICAgXCJwYWNrYWdlRGVsaXZlcmVkRnVuY3Rpb25cIixcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgYXBpLFxuICAgIC8vICAgICBkYXRhU291cmNlOiBkZWxpdmVyeURhdGFzb3VyY2UsXG4gICAgLy8gICAgIG5hbWU6IFwicGFja2FnZURlbGl2ZXJlZEZ1bmN0aW9uXCIsXG4gICAgLy8gICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL3BhY2thZ2VEZWxpdmVyZWQuanNcIiksXG4gICAgLy8gICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIC8vICAgfVxuICAgIC8vICk7XG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwYWNrYWdlRGVsaXZlcmVkUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJwYWNrYWdlRGVsaXZlcmVkXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9waXBlbGluZS9kZWZhdWx0LmpzXCIpLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtwdXRFdmVudF0sXG4gICAgfSk7XG5cbiAgICAvLyBNb3ZlZCB0byB0aGUgcGFja2FnZSBzZXJ2aWNlXG4gICAgLy8gY29uc3QgcGFja2FnZUFwaSA9IGFwcHN5bmMuR3JhcGhxbEFwaS5mcm9tR3JhcGhxbEFwaUF0dHJpYnV0ZXModGhpcywgJ0V4aXN0aW5nQXBpJywge1xuICAgIC8vICAgZ3JhcGhxbEFwaUlkOiAnWU9VUl9FWElTVElOR19BUElfSUQnLCAgLy8gUmVwbGFjZSB3aXRoIHlvdXIgQXBwU3luYyBBUEkgSURcbiAgICAvLyB9KTtcblxuICAgIC8vIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUodGhpcywgXCJwYWNrYWdlLWRlbGl2ZXJlZFwiLCB7XG4gICAgLy8gICBldmVudEJ1czogZXZlbnRzLkV2ZW50QnVzLmZyb21FdmVudEJ1c0Fybih0aGlzLCBcIlwiLCBcImFybjphd3M6ZXZlbnRzOnVzLWVhc3QtMToxMzIyNjAyNTMyODU6ZXZlbnQtYnVzL1BhY2thZ2VFdmVudEJ1c1wiKSxcbiAgICAvLyAgIGV2ZW50UGF0dGVybjoge1xuICAgIC8vICAgICBkZXRhaWxUeXBlOiBldmVudHMuTWF0Y2guZXhhY3RTdHJpbmcoXCJwYWNrYWdlLmRlbGl2ZXJlZFwiKSxcbiAgICAvLyAgICAgc291cmNlOiBbXCJkZWxpdmVyeS5hcGlcIl0sXG4gICAgLy8gICB9LFxuICAgIC8vIH0pO1xuXG5cbiAgICAvLyBydWxlLmFkZFRhcmdldChuZXcgX3RhcmdldC5BcHBTeW5jKHBhY2thZ2VBcGksIHtcbiAgICAvLyAgIGdyYXBoUUxPcGVyYXRpb246ICdtdXRhdGlvbiBQdWJsaXNoKCRtZXNzYWdlOiBTdHJpbmchKXsgcHVibGlzaChtZXNzYWdlOiAkbWVzc2FnZSkgeyBtZXNzYWdlIH0gfScsXG4gICAgLy8gICB2YXJpYWJsZXM6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgLy8gICAgIG1lc3NhZ2U6ICdoZWxsbyB3b3JsZCcsXG4gICAgLy8gICB9KSxcbiAgICAvLyB9KSk7XG4gIH1cbn1cblxuXG4iXX0=