import githubLogo from '../../assets/github.png';
import devrevLogo from '../../assets/devrev-logo.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import slackLogo from '../../assets/slack-logo.png';
import linearLogo from '../../assets/linear-logo.svg';
import asanaLogo from '../../assets/asana-logo.svg';
import clickupLogo from '../../assets/clickup-logo.svg';
import mondayLogo from '../../assets/monday-logo.svg';

export const SOURCES = [
  { name: "GitHub", logo: githubLogo, color: "#18181b", bg: "rgba(24,24,27,.08)" },
  { name: "Jira", logo: jiraLogo, color: "#0ea5e9", bg: "rgba(14,165,233,.08)" },
  { name: "DevRev", logo: devrevLogo, color: "#10b981", bg: "rgba(16,185,129,.08)" },
  { name: "Linear", logo: linearLogo, color: "#6366f1", bg: "rgba(99,102,241,.08)" },
  { name: "Asana", logo: asanaLogo, color: "#f43f5e", bg: "rgba(244,63,94,.08)" },
  { name: "ClickUp", logo: clickupLogo, color: "#8b5cf6", bg: "rgba(139,92,246,.08)" },
  { name: "Monday.com", logo: mondayLogo, color: "#f59e0b", bg: "rgba(245,158,11,.08)" },
];

export const DESTINATIONS = [
  { name: "GitHub Releases", logo: githubLogo, color: "#18181b", bg: "rgba(24,24,27,.08)" },
  { name: "DevRev Work Items", logo: devrevLogo, color: "#10b981", bg: "rgba(16,185,129,.08)" },
  { name: "Jira Release Notes", logo: jiraLogo, color: "#0ea5e9", bg: "rgba(14,165,233,.08)" },
  { name: "Slack Messages", logo: slackLogo, color: "#4A154B", bg: "rgba(74,21,75,.08)" },
  { name: "Changelog Page", abbr: "CL", color: "#8b5cf6", bg: "rgba(139,92,246,.08)" },
];
