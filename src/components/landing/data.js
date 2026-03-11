import githubLogo from '../../assets/github.png';
import devrevLogo from '../../assets/devrev-logo.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import zohoLogo from '../../assets/Zoho-logo.webp';

export const SOURCES = [
  { name: "GitHub", logo: githubLogo, color: "#18181b", bg: "rgba(24,24,27,.08)" },
  { name: "Jira", logo: jiraLogo, color: "#0ea5e9", bg: "rgba(14,165,233,.08)" },
  { name: "DevRev", logo: devrevLogo, color: "#10b981", bg: "rgba(16,185,129,.08)" },
  { name: "Zoho Sprints", logo: zohoLogo, color: "#8b5cf6", bg: "rgba(139,92,246,.08)" },
];

export const DESTINATIONS = [
  { name: "GitHub Releases", logo: githubLogo, color: "#18181b", bg: "rgba(24,24,27,.08)" },
  { name: "DevRev Work Items", logo: devrevLogo, color: "#10b981", bg: "rgba(16,185,129,.08)" },
  { name: "Jira Release Notes", logo: jiraLogo, color: "#0ea5e9", bg: "rgba(14,165,233,.08)" },
  { name: "Email Campaigns", abbr: "EM", color: "#f59e0b", bg: "rgba(245,158,11,.08)" },
  { name: "Changelog Page", abbr: "CL", color: "#8b5cf6", bg: "rgba(139,92,246,.08)" },
];
