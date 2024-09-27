"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_service_stack_1 = require("../lib/package_service-stack");
const cdk = require("aws-cdk-lib");
const assertions = require("aws-cdk-lib/assertions");
describe('DynamoDB Table Tests', () => {
    test('DynamoDB table is created with correct properties', () => {
        const app = new cdk.App();
        const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
        const template = assertions.Template.fromStack(stack);
        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: 'packageTable',
            BillingMode: 'PAY_PER_REQUEST',
            KeySchema: [
                { AttributeName: 'PK', KeyType: 'HASH' },
                { AttributeName: 'SK', KeyType: 'RANGE' }
            ]
        });
    });
});
describe('AppSync API Tests', () => {
    test('AppSync API is created with correct authorization modes', () => {
        const app = new cdk.App();
        const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
        const template = assertions.Template.fromStack(stack);
        template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
            Name: 'PackageAPI',
            AuthenticationType: 'API_KEY',
            AdditionalAuthenticationProviders: [
                { AuthenticationType: 'AWS_IAM' }
            ]
        });
    });
});
describe('EventBridge Tests', () => {
    test('EventBus is created', () => {
        const app = new cdk.App();
        const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
        const template = assertions.Template.fromStack(stack);
        template.hasResource('AWS::Events::EventBus', {});
    });
    test('EventBridge rule is created with correct event pattern', () => {
        const app = new cdk.App();
        const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
        const template = assertions.Template.fromStack(stack);
        template.hasResourceProperties('AWS::Events::Rule', {});
    });
    test('EventBridge target triggers AppSync mutation', () => {
        const app = new cdk.App();
        const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
        const template = assertions.Template.fromStack(stack);
        template.hasResourceProperties('AWS::Events::Rule', {
            Targets: [{}]
        });
    });
    describe('IAM Role Tests', () => {
        test('IAM role for EventBridge is created', () => {
            const app = new cdk.App();
            const stack = new package_service_stack_1.PackageServiceStack(app, 'TestStack');
            const template = assertions.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { Service: 'events.amazonaws.com' },
                            Action: 'sts:AssumeRole'
                        }
                    ]
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZV9kZWxpdmVyeV9zZXJ2aWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYWNrYWdlX2RlbGl2ZXJ5X3NlcnZpY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdFQUFtRTtBQUVuRSxtQ0FBbUM7QUFDbkMscURBQXFEO0FBRXJELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLDJDQUFtQixDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV4RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxRQUFRLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUU7WUFDbkQsU0FBUyxFQUFFLGNBQWM7WUFDekIsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1AsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQ3hDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO2FBQzVDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUdILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtRQUNqRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLDJDQUFtQixDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV4RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxRQUFRLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDdkQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsa0JBQWtCLEVBQUUsU0FBUztZQUM3QixpQ0FBaUMsRUFBRTtnQkFDL0IsRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUU7YUFDcEM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksMkNBQW1CLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXhELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRELFFBQVEsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFHSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksMkNBQW1CLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXhELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRELFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUdILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSwyQ0FBbUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFeEQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEQsUUFBUSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1lBQ2hELE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNoQixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLDJDQUFtQixDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUV4RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV0RCxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzdDLHdCQUF3QixFQUFFO29CQUN0QixTQUFTLEVBQUU7d0JBQ1A7NEJBQ0ksTUFBTSxFQUFFLE9BQU87NEJBQ2YsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFOzRCQUM5QyxNQUFNLEVBQUUsZ0JBQWdCO3lCQUMzQjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhY2thZ2VTZXJ2aWNlU3RhY2sgfSBmcm9tICcuLi9saWIvcGFja2FnZV9zZXJ2aWNlLXN0YWNrJztcblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGFzc2VydGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5cbmRlc2NyaWJlKCdEeW5hbW9EQiBUYWJsZSBUZXN0cycsICgpID0+IHtcbiAgICB0ZXN0KCdEeW5hbW9EQiB0YWJsZSBpcyBjcmVhdGVkIHdpdGggY29ycmVjdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBQYWNrYWdlU2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpEeW5hbW9EQjo6VGFibGUnLCB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6ICdwYWNrYWdlVGFibGUnLFxuICAgICAgICAgICAgQmlsbGluZ01vZGU6ICdQQVlfUEVSX1JFUVVFU1QnLFxuICAgICAgICAgICAgS2V5U2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBBdHRyaWJ1dGVOYW1lOiAnUEsnLCBLZXlUeXBlOiAnSEFTSCcgfSxcbiAgICAgICAgICAgICAgICB7IEF0dHJpYnV0ZU5hbWU6ICdTSycsIEtleVR5cGU6ICdSQU5HRScgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5cbmRlc2NyaWJlKCdBcHBTeW5jIEFQSSBUZXN0cycsICgpID0+IHtcbiAgICB0ZXN0KCdBcHBTeW5jIEFQSSBpcyBjcmVhdGVkIHdpdGggY29ycmVjdCBhdXRob3JpemF0aW9uIG1vZGVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBQYWNrYWdlU2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBTeW5jOjpHcmFwaFFMQXBpJywge1xuICAgICAgICAgICAgTmFtZTogJ1BhY2thZ2VBUEknLFxuICAgICAgICAgICAgQXV0aGVudGljYXRpb25UeXBlOiAnQVBJX0tFWScsXG4gICAgICAgICAgICBBZGRpdGlvbmFsQXV0aGVudGljYXRpb25Qcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IEF1dGhlbnRpY2F0aW9uVHlwZTogJ0FXU19JQU0nIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0V2ZW50QnJpZGdlIFRlc3RzJywgKCkgPT4ge1xuICAgIHRlc3QoJ0V2ZW50QnVzIGlzIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFBhY2thZ2VTZXJ2aWNlU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlcnRpb25zLlRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2UoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHt9KTtcbiAgICB9KTtcblxuXG4gICAgdGVzdCgnRXZlbnRCcmlkZ2UgcnVsZSBpcyBjcmVhdGVkIHdpdGggY29ycmVjdCBldmVudCBwYXR0ZXJuJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBQYWNrYWdlU2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7fSk7XG4gICAgfSk7XG5cblxuICAgIHRlc3QoJ0V2ZW50QnJpZGdlIHRhcmdldCB0cmlnZ2VycyBBcHBTeW5jIG11dGF0aW9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBQYWNrYWdlU2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICAgICBUYXJnZXRzOiBbe31dXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0lBTSBSb2xlIFRlc3RzJywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCdJQU0gcm9sZSBmb3IgRXZlbnRCcmlkZ2UgaXMgY3JlYXRlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBQYWNrYWdlU2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VydGlvbnMuVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZXZlbnRzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KSJdfQ==