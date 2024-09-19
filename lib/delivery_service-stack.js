"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const events = require("aws-cdk-lib/aws-events");
const _lmabda = require("aws-cdk-lib/aws-lambda");
class DeliveryServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create our dynamodb table
        // const deliveryTable = new _dynamodb.Table(this, "DeliveryTable", {
        //   tableName: "deliveryTable",
        //   partitionKey: {
        //     name: "PK",
        //     type: _dynamodb.AttributeType.STRING,
        //   },
        //   sortKey: {
        //     name: "SK",
        //     type: _dynamodb.AttributeType.STRING,
        //   },
        //   billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST,
        //   stream: _dynamodb.StreamViewType.NEW_IMAGE,
        //   removalPolicy: cdk.RemovalPolicy.DESTROY,
        // })
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
        api.addEnvironmentVariable("GRAPHQL_API", "deliveryTable.tableName");
        const eventBus = new events.EventBus(this, "DeliveryEventBus", {
            eventBusName: "DeliveryEventBus",
        });
        // const lambdaDatasource = api.addDynamoDbDataSource("DeliveryDatasource", deliveryTable)
        const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
        const packageDeliveredfunction = new _lmabda.Function(this, "packageDeliveredd", {
            handler: 'packageDelivered.lambdaHandler',
            runtime: _lmabda.Runtime.NODEJS_20_X,
            code: _lmabda.Code.fromAsset('resolvers/delivery')
        });
        const lambdaDatasource = api.addLambdaDataSource("ds", packageDeliveredfunction);
        const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
            api: api,
            name: 'PutEvent',
            dataSource: eventBridgeDs,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset('./resolvers/delivery/putEvent.js'),
        });
        lambdaDatasource.createResolver("delivery", {
            typeName: 'Mutation',
            fieldName: 'packageDelivered',
        });
    }
}
exports.DeliveryServiceStack = DeliveryServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsaXZlcnlfc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlbGl2ZXJ5X3NlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFFakQsa0RBQWlEO0FBRWpELE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwQiw0QkFBNEI7UUFFNUIscUVBQXFFO1FBQ3JFLGdDQUFnQztRQUNoQyxvQkFBb0I7UUFDcEIsa0JBQWtCO1FBQ2xCLDRDQUE0QztRQUM1QyxPQUFPO1FBQ1AsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQiw0Q0FBNEM7UUFDNUMsT0FBTztRQUNQLHdEQUF3RDtRQUN4RCxnREFBZ0Q7UUFDaEQsOENBQThDO1FBQzlDLEtBQUs7UUFFTCxnQkFBZ0I7UUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdEQsSUFBSSxFQUFFLGFBQWE7WUFDbkIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDO1lBQ2xFLG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87aUJBQ3JEO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRzthQUN6QztZQUNELFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUVyRSxNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzdELFlBQVksRUFBRSxrQkFBa0I7U0FDakMsQ0FBQyxDQUFDO1FBRUgsMEZBQTBGO1FBQzFGLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFNUUsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9FLE9BQU8sRUFBRSxnQ0FBZ0M7WUFDekMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNwQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7U0FDbkQsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLHdCQUF3QixDQUFDLENBQUE7UUFFaEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0QsR0FBRyxFQUFFLEdBQUc7WUFDUixJQUFJLEVBQUUsVUFBVTtZQUNoQixVQUFVLEVBQUUsYUFBYTtZQUN6QixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQztTQUNqRSxDQUFDLENBQUM7UUFHSCxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxrQkFBa0I7U0FDOUIsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztDQUNGO0FBbEVELG9EQWtFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1ldmVudHNcIjtcbmltcG9ydCAqIGFzIF9keW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCJcbmltcG9ydCAqIGFzIF9sbWFiZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIlxuXG5leHBvcnQgY2xhc3MgRGVsaXZlcnlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG91ciBkeW5hbW9kYiB0YWJsZVxuXG4gICAgICAgIC8vIGNvbnN0IGRlbGl2ZXJ5VGFibGUgPSBuZXcgX2R5bmFtb2RiLlRhYmxlKHRoaXMsIFwiRGVsaXZlcnlUYWJsZVwiLCB7XG4gICAgICAgIC8vICAgdGFibGVOYW1lOiBcImRlbGl2ZXJ5VGFibGVcIixcbiAgICAgICAgLy8gICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgLy8gICAgIG5hbWU6IFwiUEtcIixcbiAgICAgICAgLy8gICAgIHR5cGU6IF9keW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgICAgLy8gICB9LFxuICAgICAgICAvLyAgIHNvcnRLZXk6IHtcbiAgICAgICAgLy8gICAgIG5hbWU6IFwiU0tcIixcbiAgICAgICAgLy8gICAgIHR5cGU6IF9keW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgICAgLy8gICB9LFxuICAgICAgICAvLyAgIGJpbGxpbmdNb2RlOiBfZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgICAvLyAgIHN0cmVhbTogX2R5bmFtb2RiLlN0cmVhbVZpZXdUeXBlLk5FV19JTUFHRSxcbiAgICAgICAgLy8gICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICAvLyB9KVxuXG4gICAgICAgIC8vY3JlYXRlIG91ciBBUElcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCBcIkRlbGl2ZXJ5QVBJXCIsIHtcbiAgICAgICAgICBuYW1lOiBcIkRlbGl2ZXJ5QVBJXCIsXG4gICAgICAgICAgZGVmaW5pdGlvbjogYXBwc3luYy5EZWZpbml0aW9uLmZyb21GaWxlKFwiLi9zY2hlbWEvc2NoZW1hLmdyYXBocWxcIiksXG4gICAgICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dDb25maWc6IHtcbiAgICAgICAgICAgIGZpZWxkTG9nTGV2ZWw6IGFwcHN5bmMuRmllbGRMb2dMZXZlbC5BTEwsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4cmF5RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXBpLmFkZEVudmlyb25tZW50VmFyaWFibGUoXCJHUkFQSFFMX0FQSVwiLCBcImRlbGl2ZXJ5VGFibGUudGFibGVOYW1lXCIpO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50QnVzID0gbmV3IGV2ZW50cy5FdmVudEJ1cyh0aGlzLCBcIkRlbGl2ZXJ5RXZlbnRCdXNcIiwge1xuICAgICAgICAgIGV2ZW50QnVzTmFtZTogXCJEZWxpdmVyeUV2ZW50QnVzXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNvbnN0IGxhbWJkYURhdGFzb3VyY2UgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFwiRGVsaXZlcnlEYXRhc291cmNlXCIsIGRlbGl2ZXJ5VGFibGUpXG4gICAgICAgIGNvbnN0IGV2ZW50QnJpZGdlRHMgPSBhcGkuYWRkRXZlbnRCcmlkZ2VEYXRhU291cmNlKCdFdmVudEJyaWRnZScsIGV2ZW50QnVzKTtcblxuICAgICAgICBjb25zdCBwYWNrYWdlRGVsaXZlcmVkZnVuY3Rpb24gPSBuZXcgX2xtYWJkYS5GdW5jdGlvbih0aGlzLCBcInBhY2thZ2VEZWxpdmVyZWRkXCIsIHtcbiAgICAgICAgICBoYW5kbGVyOiAncGFja2FnZURlbGl2ZXJlZC5sYW1iZGFIYW5kbGVyJyxcbiAgICAgICAgICBydW50aW1lOiBfbG1hYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICAgICAgY29kZTogX2xtYWJkYS5Db2RlLmZyb21Bc3NldCgncmVzb2x2ZXJzL2RlbGl2ZXJ5JylcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgbGFtYmRhRGF0YXNvdXJjZSA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKFwiZHNcIiwgcGFja2FnZURlbGl2ZXJlZGZ1bmN0aW9uKVxuXG4gICAgICAgIGNvbnN0IHB1dEV2ZW50ID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsICdQdXRFdmVudCcsIHtcbiAgICAgICAgICBhcGk6IGFwaSxcbiAgICAgICAgICBuYW1lOiAnUHV0RXZlbnQnLFxuICAgICAgICAgIGRhdGFTb3VyY2U6IGV2ZW50QnJpZGdlRHMsXG4gICAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldCgnLi9yZXNvbHZlcnMvZGVsaXZlcnkvcHV0RXZlbnQuanMnKSxcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBsYW1iZGFEYXRhc291cmNlLmNyZWF0ZVJlc29sdmVyKFwiZGVsaXZlcnlcIiwge1xuICAgICAgICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgICAgICAgIGZpZWxkTmFtZTogJ3BhY2thZ2VEZWxpdmVyZWQnLFxuICAgICAgICB9KTtcbiAgfVxufVxuXG5cbiJdfQ==