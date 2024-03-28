import { Sparkles } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
} from 'ui'

import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { useIndexAdvisorQuery } from 'data/index-advisor/index-advisor-query'

type Props = {
  sql: string
}

// Remove comments at the end of each line
function stripComments(sql: string): string {
  const lines = sql.split('\n')
  const filteredLines = lines.map((line) => line.replace(/--(.*)$/, '').trim())

  const filteredQuery = filteredLines.filter((line) => line.length > 0).join('\n')

  return filteredQuery
}

const ReportIndexAdvisorModal = ({ sql }: Props) => {
  const { project } = useProjectContext()
  const strippedSql = stripComments(sql)

  const wrappedSql = `SELECT * FROM index_advisor('${strippedSql}')`

  const { data: suggestions } = useIndexAdvisorQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    sql: wrappedSql,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="text" className="bg-yellow-50">
          <span className="flex items-center gap-2 px-3">
            <Sparkles strokeWidth={1} size={15} /> View index suggestions for this query
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-5xl p-0')}>
        <DialogHeader className="pb-0">
          <DialogTitle>Index suggestions</DialogTitle>
          <DialogDescription>Speed up your queries with indexes</DialogDescription>
          <div className="p-4 bg-white">
            <div className="text-xs uppercase bg-surface-200 rounded-lg px-4 py-1 inline-block ">
              This is the query you're inspecting
            </div>
            <div className="font-mono">{sql}</div>
          </div>
          <div className="p-4 bg-white font-mono">
            <div className="text-xs uppercase bg-surface-200 rounded-lg px-4 py-1 inline-block ">
              This is what index advisor runs
            </div>
            <div>{wrappedSql}</div>
          </div>
          <div>
            <div>Suggestions</div>
            <div className="text-xs uppercase bg-surface-200 rounded-lg px-4 py-1 inline-block ">
              This is what index advisor returns
            </div>
            {suggestions?.length === 0 ? (
              <div>No suggestions available</div>
            ) : (
              suggestions?.map((suggestion, index) => (
                <div key={index}>
                  <div>Startup Cost Before: {suggestion.startup_cost_before}</div>
                  <div>Startup Cost After: {suggestion.startup_cost_after}</div>
                  <div>Total Cost Before: {suggestion.total_cost_before}</div>
                  <div>Total Cost After: {suggestion.total_cost_after}</div>
                  <div className="mt-4">Index Statements:</div>
                  <ul>
                    <div className="text-xs uppercase bg-surface-200 rounded-lg px-4 py-1 inline-block ">
                      These are the main index statements
                    </div>
                    {suggestion.index_statements.map((statement, statementIndex) => (
                      <li key={statementIndex}>{statement}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ReportIndexAdvisorModal
