import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import IngestParseSidebar from './IngestParseSidebar'
import BlankSlate from '../components/BlankSlate'
import { JOB_PHASES } from '../constants/routes'
import MetadataDisplayTable from '../components/MetadataDisplayTable'

const LinkageAnnotationPage = () => {
  const phase = useJobStore((state) => state.phase)

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSE) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar />
        <MetadataDisplayTable
          columns={[
            { key: 'name', label: 'File Name' },
            { key: 'resolution', label: 'Resolution' },
            { key: 'frameRate', label: 'FPS' },
            { key: 'size', label: 'File Size' },
          ]}
          data={[
            {
              name: 'really_long_file_name_1.mov',
              size: '15 Mb',
              resolution: '1920x1080',
              frameRate: '30',
              warnings: [],
              errors: [],
            },
            {
              name: 'really_long_file_name_2.mov',
              size: '15 Mb',
              resolution: '1920x1080',
              frameRate: '30',
              warnings: ['not in a folder'],
              errors: [],
            },
            {
              name: 'really_long_file_name_3.mov',
              size: '15 Mb',
              resolution: '1920x1080',
              frameRate: '30',
              warnings: [],
              errors: ['file name is longer than 20 chars'],
            },
            {
              name: 'really_long_file_name_4.mov',
              size: '15 Mb',
              resolution: '1920x1080',
              frameRate: '30',
              warnings: ['not in a folder', 'here is a long warning with lots of characters'],
              errors: ['file name is longer than 20 chars'],
            },
          ]}
        />
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
