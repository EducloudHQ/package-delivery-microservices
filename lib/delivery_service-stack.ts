import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as events from "aws-cdk-lib/aws-events";
import * as _dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as _lmabda from "aws-cdk-lib/aws-lambda"

export class DeliveryServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
        })

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

        // api.addEnvironmentVariable("GRAPHQL_API", "deliveryTable.tableName");
        const deliveryDatasource = api.addDynamoDbDataSource("deliveryDatasource", deliveryTable)
        const eventBus = new events.EventBus(this, "DeliveryEventBus", {
          eventBusName: "DeliveryEventBus",
        });

        // const lambdaDatasource = api.addDynamoDbDataSource("DeliveryDatasource", deliveryTable)
        const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);

        // const packageDeliveredfunction = new _lmabda.Function(this, "packageDeliveredd", {
        //   handler: 'packageDelivered.lambdaHandler',
        //   runtime: _lmabda.Runtime.NODEJS_20_X,
        //   code: _lmabda.Code.fromAsset('resolvers/delivery')
        // })
        // const lambdaDatasource = api.addLambdaDataSource("ds", packageDeliveredfunction)

        const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
          api: api,
          name: 'PutEvent',
          dataSource: eventBridgeDs,
          runtime: appsync.FunctionRuntime.JS_1_0_0,
          code: appsync.Code.fromAsset('./resolvers/delivery/putEvent.js'),
        });


    const packageDelivered = new appsync.AppsyncFunction(
      this,
      "packageDeliveredFunction",
      {
        api,
        dataSource: deliveryDatasource,
        name: "packageDeliveredFunction",
        code: appsync.Code.fromAsset("./resolvers/package/packageDelivered.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );
    new appsync.Resolver(this, "packageDeliveredResolver", {
      api,
      typeName: "Mutation",
      fieldName: "packageDelivered",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [packageDelivered, putEvent],
    });

  //       lambdaDatasource.createResolver("delivery", {
  //         typeName: 'Mutation',
  //         fieldName: 'packageDelivered',
  //       });
  }
}


