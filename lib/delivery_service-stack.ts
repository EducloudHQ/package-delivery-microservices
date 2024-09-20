import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as events from "aws-cdk-lib/aws-events";
import * as _dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as _lmabda from "aws-cdk-lib/aws-lambda"
import * as _target from "aws-cdk-lib/aws-events-targets";

export class DeliveryServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create our API
    const api = new appsync.GraphqlApi(this, "DeliveryAPI", {
      name: "DeliveryAPI",
      definition: appsync.Definition.fromFile("./schema/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    // Reference our event bus
    const packageDeliveryEventBusARN = this.node.tryGetContext('packageDeliveryEventBusARN');
    
    const eventBus = events.EventBus.fromEventBusArn(this, "eventBus", packageDeliveryEventBusARN)

    // Create event bus datasource
    const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
    const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
      api: api,
      name: 'PutEvent',
      dataSource: eventBridgeDs,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset('./resolvers/delivery/putEvent.js'),
    });

    // Appsync resolver
    new appsync.Resolver(this, "packageDelivereddResolver", {
      api,
      typeName: "Mutation",
      fieldName: "packageDelivered",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [putEvent],
    });
    
  }
}


