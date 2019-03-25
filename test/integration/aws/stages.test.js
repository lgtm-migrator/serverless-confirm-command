// External dependencies
const { expect, use } = require('chai');
const { spawnSync } = require('child_process');
const dirtyChai = require('dirty-chai');

use(dirtyChai);

describe('Integration tests of the plugin - using AWS stages only', () => {
    const folder = 'stages';
    const pathToServerlessFramework = '../../../../node_modules/serverless/bin/serverless';

    it('should indicate the command as not confirmed if the option is not provided', () => {
        const subprocess = spawnSync(
            'node',
            [pathToServerlessFramework, 'deploy function', '--stage', 'prod'],
            { cwd: `${__dirname}/${folder}` },
        );
        const stdout = subprocess.stdout.toString('utf-8');
        const notConfirmed = stdout.includes('Command not confirmed.');
        const serverlessError = stdout.includes('Serverless Confirm Command Error');
        expect(notConfirmed).to.be.true();
        expect(serverlessError).to.be.true();
    }).timeout(5000);

    it('should indicate the command as confirmed if the option is provided', () => {
        const subprocess = spawnSync(
            'node',
            [pathToServerlessFramework, 'deploy function', '--stage', 'prod', '--confirm'],
            { cwd: `${__dirname}/${folder}` },
        );
        const stdout = subprocess.stdout.toString('utf-8');
        const confirmed = stdout.includes('Command confirmed.');
        const serverlessError = stdout.includes('Serverless Confirm Command Error');
        expect(confirmed).to.be.true();
        expect(serverlessError).to.be.false();
    }).timeout(5000);

    it('should not do anything if the command does not require confirmation', () => {
        const subprocess = spawnSync('node', [pathToServerlessFramework, 'remove'], {
            cwd: `${__dirname}/${folder}`,
        });
        const stdout = subprocess.stdout.toString('utf-8');
        const confirmed = stdout.includes('Command confirmed.');
        const notConfirmed = stdout.includes('Command not confirmed.');
        const serverlessError = stdout.includes('Serverless Confirm Command Error');
        expect(notConfirmed).to.be.false();
        expect(confirmed).to.be.false();
        expect(serverlessError).to.be.false();
    }).timeout(5000);
});
