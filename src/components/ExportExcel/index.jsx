import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'sheetjs-style'

export function ExportExcel({ fileName, table }) {
  function tableToObj(table) {
    const trs = table.rows
    const trl = trs.length
    let i = 0
    let j = 0
    const keys = []
    let obj
    const ret = []

    for (; i < trl; i++) {
      if (i === 0) {
        for (; j < trs[i].children.length; j++) {
          keys.push(trs[i].children[j].innerHTML)
        }
      } else {
        obj = {}
        for (j = 0; j < trs[i].children.length; j++) {
          obj[keys[j]] = trs[i].children[j].innerHTML
        }
        ret.push(obj)
      }
    }
    exportToExcel(ret)
  }

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToExcel = async (ret) => {
    console.log(ret)
    const ws = XLSX.utils.json_to_sheet(ret)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <div className="botaoDireita">
      <button
        type="submit"
        onClick={() => {
          tableToObj(table)
        }}
      >
        Exportar
      </button>
    </div>
  )
}
