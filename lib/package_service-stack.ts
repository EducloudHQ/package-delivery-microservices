import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as events from "aws-cdk-lib/aws-events";
import * as _dynamodb from "aws-cdk-lib/aws-dynamodb"
import path = require("path");


export class PackageServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create our dynamodb table

    const packageTable = new _dynamodb.Table(this, "PackageTable", {
      tableName: "packageTable",
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
    const api = new appsync.GraphqlApi(this, "PackageAPI", {
      name: "PackageAPI",
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

    api.addEnvironmentVariable("TABLE_NAME", packageTable.tableName);

    const eventBus = new events.EventBus(this, "PackageEventBus", {
      eventBusName: "PackageEventBus",
    });

    const packageDatasource = api.addDynamoDbDataSource("PackageDatasource", packageTable)
    const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);


    const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
      api: api,
      name: 'PutEvent',
      dataSource: eventBridgeDs,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset('./resolvers/package/putEvent.js'),
    });

    const createPackageFunction = new appsync.AppsyncFunction(this, "createPackageFunction", {
      api,
      name: "createPackageFunction",
      dataSource: packageDatasource,
      code: appsync.Code.fromAsset("./resolvers/package/createPackage.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const updatePackageFunction = new appsync.AppsyncFunction(this, "updatePackageFunction", {
      api,
      name: "updatePackageFunction",
      dataSource: packageDatasource,
      code: appsync.Code.fromAsset("./resolvers/package/updatePackage.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });


    const assignPackageToDeliveryAgentFunction = new appsync.AppsyncFunction(
      this,
      "assignPackageToDeliveryAgentFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "assignPackageToDeliveryAgentFunction",
        code: appsync.Code.fromAsset(
          "./resolvers/package/assignPackageToDeliveryAgent.js"
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const packageTimelapseFunction = new appsync.AppsyncFunction(
      this,
      "packageTimelapseFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "packageTimelapseFunction",
        code: appsync.Code.fromAsset("./resolvers/package/packageTimelapse.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getPackageFunction = new appsync.AppsyncFunction(
      this,
      "getPackageFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getPackageFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getPackage.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getAllPackagesFunction = new appsync.AppsyncFunction(
      this,
      "getAllPackagesFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getAllPackagesFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getAllPackages.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );


    const getAllPackagesBaseOnStatusFunction = new appsync.AppsyncFunction(
      this,
      "getAllPackagesBaseOnStatusFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getAllPackagesBaseOnStatusFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getAllPackagesBaseOnStatus.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getCurrentPackageMovementFunction = new appsync.AppsyncFunction(
      this,
      "getCurrentPackageMovementFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getCurrentPackageMovementFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getCurrentPackageMovement.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );



    new appsync.Resolver(this, "createPackagePipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "createPackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [createPackageFunction, putEvent],
    });

    new appsync.Resolver(this, "updatePackagePipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "updatePackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [updatePackageFunction, putEvent],
    });

    new appsync.Resolver(this, "assignPackageToDeliveryPipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "assignPackageToDeliveryAgent",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [assignPackageToDeliveryAgentFunction, putEvent],
    });

    new appsync.Resolver(this, "packageTimelapseResolver", {
      api,
      typeName: "Mutation",
      fieldName: "packageTimelapse",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [packageTimelapseFunction],
    });

    new appsync.Resolver(this, "getPackageResolver", {
      api,
      typeName: "Query",
      fieldName: "getPackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getPackageFunction],
    });


    new appsync.Resolver(this, "getAllPackagesResolver", {
      api,
      typeName: "Query",
      fieldName: "getAllPackages",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getAllPackagesFunction],
    });

    new appsync.Resolver(this, "getAllPackagesBaseOnStatusResolver", {
      api,
      typeName: "Query",
      fieldName: "getAllPackagesBaseOnStatus",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getAllPackagesBaseOnStatusFunction],
    });

    new appsync.Resolver(this, "getCurrentPackageMovementResolver", {
      api,
      typeName: "Query",
      fieldName: "getCurrentPackageMovement",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getCurrentPackageMovementFunction],
    });

    // new appsync.Resolver(this, "onCreatePackageEvent", {
    //   api,
    //   typeName: "Subscription",
    //   fieldName: "onCreatePackageEvent",
    //   dataSource: new appsync.NoneDataSource(this, 'NoneDataSource', {
    //     api: api,
    //     name: 'onCreatePackageEvent',
    //   }),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    //   code: appsync.Code.fromAsset("./resolvers/package/onCreatePackageEvent.js"),
    // });


    //////////////////////////
    new cdk.CfnOutput(this, "appsync api key", {
      value: api.apiKey!,
    });

    new cdk.CfnOutput(this, "appsync endpoint", {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "appsync apiId", {
      value: api.apiId,
    });
  }
}