import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { executeSql } from '../sql/execute-sql-query'
import { indexAdvisorKeys } from './keys'

export type IndexAdvisorVariables = {
  projectRef?: string
  connectionString?: string
  sql: string
}

export type Suggestion = {
  startup_cost_before: number
  startup_cost_after: number
  total_cost_before: number
  total_cost_after: number
  index_statements: string[]
  errors: []
}

const getIndexAdvisorSuggestions = async (
  { projectRef, connectionString, sql }: IndexAdvisorVariables,
  signal?: AbortSignal
) => {
  const { result } = await executeSql(
    {
      projectRef,
      connectionString,
      sql,
      queryKey: indexAdvisorKeys.suggestion(projectRef),
    },
    signal
  )
  return result
}

export type IndexAdvisorData = Suggestion[]
export type IndexAdvisorError = unknown

export const useIndexAdvisorQuery = <TData = IndexAdvisorData>(
  { projectRef, connectionString, sql }: IndexAdvisorVariables,
  { enabled, ...options }: UseQueryOptions<IndexAdvisorData, IndexAdvisorError, TData> = {}
) =>
  useQuery<IndexAdvisorData, IndexAdvisorError, TData>(
    indexAdvisorKeys.suggestion(projectRef),
    ({ signal }) => getIndexAdvisorSuggestions({ projectRef, connectionString, sql }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      ...options,
    }
  )
