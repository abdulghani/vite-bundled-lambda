import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnOutput, Duration, Stack } from "aws-cdk-lib/core";

export class ApiStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);

    const lambdaFunction = new lambda.Function(this, "test-esm", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "handler.handler",
      code: lambda.Code.fromAsset("./dist"),
      memorySize: 128,
      timeout: Duration.minutes(2),
    });

    const httpAPI = new HttpApi(this, "test-esm-api", {
      apiName: "test-esm-api",
    });

    const lambdaIntegration = new HttpLambdaIntegration(
      "LambdaIntegration",
      lambdaFunction
    );
    httpAPI.addRoutes({
      path: "/{proxy+}",
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    const INTERNAL_API_HOST = `https://${httpAPI.httpApiId}.execute-api.${
      Stack.of(this).region
    }.${Stack.of(this).urlSuffix}`;

    new CfnOutput(this, "ApiUrl", {
      description: "The URL of the API",
      value: INTERNAL_API_HOST,
    });
    lambdaFunction.addEnvironment("INTERNAL_API_HOST", INTERNAL_API_HOST);
  }
}
