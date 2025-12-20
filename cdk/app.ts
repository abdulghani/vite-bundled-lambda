#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { ApiStack } from "./stack.js";

const app = new cdk.App();
new ApiStack(app, "ApiStack");
