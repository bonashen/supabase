export const indexAdvisorKeys = {
  suggestion: (projectRef: string | undefined) =>
    ['projects', projectRef, 'index-advisor'] as const,
}
