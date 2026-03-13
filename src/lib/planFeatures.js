/**
 * Builds a display feature list from a plan's entitlements JSONB.
 * Labels are hardcoded here — counts come from the DB.
 */
export function buildFeatures(entitlements = {}) {
  const e = entitlements;
  const features = [];

  // Generations
  if (e.max_generations_per_month === -1) {
    features.push({ text: 'Unlimited generations', included: true });
  } else if (e.max_generations_per_month > 0) {
    features.push({ text: `${e.max_generations_per_month} release notes / month`, included: true });
  }

  // Sources per release
  if (e.max_sources_per_release === -1) {
    features.push({ text: 'Multi-source releases', included: true });
  } else if (e.max_sources_per_release > 0) {
    features.push({ text: `${e.max_sources_per_release} integration source`, included: true });
  }

  // Projects
  if (e.max_projects === -1) {
    features.push({ text: 'Unlimited projects', included: true });
  } else if (e.max_projects > 0) {
    features.push({ text: `${e.max_projects} project${e.max_projects > 1 ? 's' : ''}`, included: true });
  }

  // BYOK
  if (e.byok_enabled === true) {
    features.push({ text: 'Bring your own AI key', included: true });
  } else if (e.byok_enabled === false) {
    features.push({ text: 'Releaslyy AI (built-in)', included: true });
  }

  // Publishes per month
  if (e.max_publishes_per_month === -1) {
    features.push({ text: 'Unlimited publishes / month', included: true });
  } else if (e.max_publishes_per_month > 0) {
    features.push({ text: `${e.max_publishes_per_month} publishes / month`, included: true });
  }

  // Publish destinations
  const pubs = e.publish_destinations;
  if (Array.isArray(pubs) && pubs.length > 0) {
    if (pubs.includes('*')) {
      features.push({ text: 'All publish destinations', included: true });
    } else {
      const labels = {
        github_releases: 'GitHub',
        jira_release: 'Jira',
        devrev_articles: 'DevRev',
        slack: 'Slack',
        email: 'Email',
        changelog_page: 'Changelog page',
      };
      const names = pubs.map(p => labels[p] || p).join(', ');
      features.push({ text: `Publish to ${names}`, included: true });
    }
  }

  // Team members
  if (e.max_team_members === -1) {
    features.push({ text: 'Unlimited team members', included: true });
  } else if (e.max_team_members > 1) {
    features.push({ text: `Up to ${e.max_team_members} team members`, included: true });
  }

  // Boolean features
  if (e.editor_access) features.push({ text: 'Release notes editor', included: true });
  if (e.markdown_export) features.push({ text: 'Markdown & copy export', included: true });
  if (e.editor_collaboration) features.push({ text: 'Editor collaboration', included: true });
  if (e.approval_workflow) features.push({ text: 'Release approval workflow', included: true });
  if (e.usage_analytics) features.push({ text: 'Usage & token analytics', included: true });
  if (e.changelog_page) features.push({ text: 'Public changelog page', included: true });
  if (e.email_campaigns) features.push({ text: 'Email campaign publishing', included: true });
  if (e.sso_saml) features.push({ text: 'SSO / SAML', included: true });
  if (e.audit_logs) features.push({ text: 'Audit logs', included: true });
  if (e.custom_integrations) features.push({ text: 'Custom integrations', included: true });
  if (e.dedicated_account_manager) features.push({ text: 'Dedicated account manager', included: true });

  // Support
  if (e.priority_support) {
    features.push({ text: 'Priority support', included: true });
  } else {
    features.push({ text: 'Community support', included: true });
  }

  return features;
}
