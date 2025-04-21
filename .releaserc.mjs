/**
 * This SemVer procedure contains a small hack. All commits to main
 * will yield a canary npm packages until an action runs with the
 * SEMVER_RELEASE=true environment variable. This assures no NPM package
 * is released from other branches, nor released by mistake
 */

// Enable some features when this is an official release
const shouldRelease = process.env.SEMVER_RELEASE === 'true'

// https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#workflow-configuration
export default {
    branches: [
        // https://stackoverflow.com/questions/67602222 The branch should exist
        // and should be PRESENT ON ORIGIN for this hack to work.
        'root',
        {
            name: 'main',
            channel: false,
            prerelease: shouldRelease ? false : 'canary'
        }
    ],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/npm',
        '@semantic-release/github'
    ]
}
