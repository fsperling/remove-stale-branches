import { Octokit } from "@octokit/core";
import { removeStaleBranches } from "./removeStaleBranches";
import process from "process";

let octokit = new Octokit({
  options: {
    auth: process.env.GITHUB_TOKEN,
  },
});

const timer = setTimeout(() => {}, 120000);
removeStaleBranches(octokit, {
  isDryRun: false,
  daysBeforeBranchStale: 365,
  daysBeforeBranchDelete: 30,
  staleCommentMessage:
    "@{author} Your branch [{branchName}]({branchUrl}) hasn't been updated in the last 365 days and is marked as stale. Please have a look if it is still needed.",
  protectedBranchesRegex: "^(main|master)$",
  operationsPerRun: 500,
  githubToken: process.env.GITHUB_TOKEN || "",
  exemptProtectedBranches: true,
  repo: {
    owner: "sipgate",
    repo: "sipgate-deployment",
  },
})
  .then(() => clearTimeout(timer))
  .catch((e) => console.log(e));
