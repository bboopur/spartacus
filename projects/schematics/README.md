# Getting Started

This section is for Spartacus developers and anybody else who works with Spartacus source code.
To see the documentation on how to use schematics from a customers perspective, see: [https://sap.github.io/spartacus-docs/schematics](https://sap.github.io/spartacus-docs/schematics)

## Prerequisites

Install angular schematics globally: `npm install -g @angular-devkit/schematics-cli`.
Make sure that Angular CLI is up to date: `npm install -g @angular/cli@latest`

## Testing schematics

### Unit testing

To run all the schematics unit tests:

1. `$ cd projects/schematics`
2. `$ yarn` - to install dependencies
3. `$ yarn test`

The schematics already have unit tests to cover the migration tasks they were designed to perform. However, you might want to test if the new schematics configuration you added will produce the expected result when a user will perform a migration with the help of the schematics without running a full migration on an app, which would be very time consuming. A convenient way to test your new config is to temporarily modify a schematics unit test case and use an example that will use your new config instead. After you assess your migration scenario plays out as expected, you can revert the changes you did in the unit test.

The following points provide guidance on how to achieve that.

- let's say you're working on a constructor deprecation task, in which case you would open the `projects/schematics/src/migrations/mechanism/constructor-deprecations/constructor-deprecations_spec.ts`.
- first thing to change is the `MIGRATION_SCRIPT_NAME`. If you're testing a migration task for v3, you would change the value of the `MIGRATION_SCRIPT_NAME` constant to `migration-v3-constructor-deprecations-03` (notice the **v3** in the name). To see the exact name of the migration script, you can go to `projects/schematics/src/migrations/migrations.json` and copy-paste the script's name you're testing to the spec file.
- next, you can pick and choose a test that's using a class as an input (where the class is a made up testing class from customers' perspective, represented as a string). The output of the test is also a class, modified by the schematics (basically the expected result); again, this class is also represented as a string. Therefore, in case of the constructor deprecation, you can modify e.g. `ADD_AND_REMOVE_PARAMETER_VALID_TEST_CLASS` constant to match your made up input. You can then just `console.log()` the result and assert the migrated code manually in the console.
- in order to save yourself some time, it's recommended to `fdescribe` (or `fit`) the test that's using the constants from the previous step. To run the test(s), follow the steps from the beginning of this section. An additional benefit is that it removes a lot of noise in the terminal, which is especially useful when using `console.log()`ing the result.

### Integration testing

The best way to test an unpublished schematic is to publish it to a local npm registry. For more, see [developing schematics](#Developing-schematics)

## Developing schematics

### Preparing setup

- Install verdaccio `npm i -g verdaccio` (only for the first time)
- Create new angular project `ng new schematics-test --style=scss`
- Run verdaccio script `ts-node ./tools/schematics/testing.ts`

### Publishing to verdaccio

- before you publish for the first time make sure you have builded libs or run `build all libs`
- select option `publish` from the verdaccio script (it will bump package patch version and publish to verdaccio)
- do changes, rebuild changed libraries and publish once again (every publish will bump to even higher version)

### Workflow for testing schematics

- run schematics you want to test (to revert schematics changes `git reset --hard HEAD && rm -rf node_modules && npm i`)
- try until everything is perfect

### Workflow for testing migrations

- add Spartacus by running e.g. `ng add @spartacus/schematics@<version> --baseUrl https://spartacus-demo.eastus.cloudapp.azure.com:8443/ --baseSite electronics-spa`. Note the `<version>` after `ng add @spartacus/schematics`. This should be lower than the one you're going to publish. E.g. if developing schematics for Spartacus 3.0, then you should install Spartacus 2.0.
- commit the changes, if any.
- run schematics you want to test (to revert schematics changes `git reset --hard HEAD && rm -rf node_modules && npm i`)
- try until everything is perfect

## Update schematics

### The update schematic structure

The `projects/schematics/src/migrations/migrations.json` file contains all migration scripts for all Spartacus versions:

- _name_ property is important for developers to quickly understand what the migration script is doing. By convention, the migration _name_ should follow `migration-v<version>-<migration-feature-name>-<sequence-number>` pattern, where:
  - _version_ should indicate for which Spartacus version the migration is intended.
  - _migration-feature-name_ is a short name that describes what the migration is doing.
  - _sequence-number_ is the sequence number in which the migrations should be executed
  - An example is _migration-v2-update-cms-component-state-02_.
- _version_ is _really_ important for the Angular's update mechanism, as it is used to automatically execute the required migration scripts for the current project's version. For more information about this, please check [releasing update schematics](#releasing-update-schematics) section.
- _factory_ - points to the specific migration script.
- _description_ - a short free-form description field for developers.

### Validations

If some validations are required to be ran before actually upgrading the Spartacus version, the "migration script" located in `projects/schematics/src/migrations/2_0/validate.ts` can be used.

### Constructor deprecation

The `projects/schematics/src/migrations/2_0/constructor-deprecations.ts` performs the constructor migration tasks. Usually, a developer does not need to touch this file, but they should rather describe the constructor deprecation in `projects/schematics/src/migrations/2_0/constructor-deprecation-data.ts`. The constant `CONSTRUCTOR_DEPRECATION_DATA` describes the deprecated constructor and has `addParams` and `removeParams` properties in which you can specify which parameters should be added or removed, respectively.

### Commenting code

Another common case is to place a comment in customer's code base, describing what should they do in order to upgrade to a new Spartacus version. We should do this only in cases where upgrading manually is easy, but writing a migration script would be too complex.
The `projects/schematics/src/shared/utils/file-utils.ts#insertCommentAboveIdentifier` method will add comment above the specified _identifier_ TypeScript node.

Some examples:

- adding a comment above the removed API method, guiding customers which method they can use instead.
- adding a comment above the Ngrx action in which we changed parameters

### Component deprecation

Similar to [constructor deprecation](#Constructor-deprecation), `projects/schematics/src/migrations/2_0/component-deprecations.ts` performs the component migration tasks, for both component _*.ts_ and _HTML_ templates. Usually, a developer does not need to touch this file, and they should rather describe the component deprecation in `projects/schematics/src/migrations/2_0/component-deprecations-data.ts`. The constant `COMPONENT_DEPRECATION_DATA` describes the deprecated components.

### CSS

To handle CSS changes, we are printing a link to the CSS docs, where customers can look up which CSS selectors have changed between Spartacus versions. For this reason, if making a change to a CSS selector, please update this docs. (link to follow).

## Releasing update schematics

This section is for developers who do the release, and it specifies how to manage the versions in `projects/schematics/src/migrations/migrations.json`.

The migration scripts that are listed here should be executed each time customers perform the automatic upgrade by running `ng update @spartacus/schematics --next`:

- `migration-v*-validate-01`
- `migration-v*-methods-and-properties-deprecations-02`
- `migration-v*-constructor-deprecations-03`
- `migration-v*-removed-public-api-deprecation-04`
- `migration-v*-component-deprecations-05`
- `migration-v*-css-06`
- `migration-v*-config-deprecations-09`

The `v*` refers _only_ to the _latest major_ Spartacus version (v3 as of this moment).

Please bump the `version` in `migration.json` only for the migration scripts listed above, and _do not change the other script's versions_.
This means that the scripts for the older major Spartacus versions should _also **not** be updated_.

This is _really_ important for the Angular's update mechanism, as it is used to automatically execute the required migration scripts for the current project's version.
It's also important to note that after we release a Spartacus _next.x_, or an _rc.x_ version, all the migration scripts that are written after the release _have_ to specify the future release version.
E.g. if Spartacus _2.0.0-next.1_ has been released, then the _new_ migration scripts (added after it _2.0.0-next.1_) should specify the next version (e.g. _2.0.0-next.2_).
This is required for clients that upgrade frequently and it will make angular to run only the new migration scripts for them, avoiding the same scripts to run twice.
However, there are exceptions from this rule - as we have data-driven generic mechanisms for e.g. constructor deprecation, we have to bump the version in `migrations.json` for those scripts.
