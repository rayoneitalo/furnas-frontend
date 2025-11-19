import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Player } from './types'
import { MAIN_LIST_CAPACITY } from './constants'

const getProfileLabel = (profile: string) => {
  const labels: Record<string, string> = {
    LINHA: 'Linha',
    GOLEIRO: 'Goleiro',
    RESENHA: 'Resenha',
  }
  return labels[profile] || profile
}

export function exportPlayersToPDF(players: Player[]) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPosition = margin

  // Filtra jogadores por status, excluindo RESENHA da lista principal
  const mainPlayers = players.filter(
    (p) => p.status === 'MAIN' && p.profile !== 'RESENHA'
  )
  const waitlistPlayers = players.filter(
    (p) => p.status === 'WAITLIST' && p.profile !== 'RESENHA'
  )
  const resenhaPlayers = players.filter((p) => p.profile === 'RESENHA')

  // Título
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Lista de Jogadores - FURNAS F.C.', pageWidth / 2, yPosition, {
    align: 'center',
  })
  yPosition += 10

  // Data de geração
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const dateStr = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.text(`Gerado em: ${dateStr}`, pageWidth / 2, yPosition, {
    align: 'center',
  })
  yPosition += 15

  // Lista Principal
  if (mainPlayers.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(
      `Lista Principal (${mainPlayers.length}/${MAIN_LIST_CAPACITY})`,
      margin,
      yPosition,
    )
    yPosition += 8

    const mainTableData = mainPlayers.map((player, index) => [
      (index + 1).toString(),
      player.name,
      getProfileLabel(player.profile),
      player.rg || '-',
      player.phone || '-',
      player.isGuest
        ? player.invitedBy
          ? `Convidado por ${player.invitedBy.name}`
          : 'Convidado'
        : '-',
      new Date(player.joinTimestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Nome', 'Perfil', 'RG', 'Telefone', 'Convidado', 'Data']],
      body: mainTableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 37, 41], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 45 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      margin: { left: margin, right: margin },
    })

    yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // Lista de Espera
  if (waitlistPlayers.length > 0) {
    // Verifica se precisa de nova página
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Lista de Espera (${waitlistPlayers.length})`, margin, yPosition)
    yPosition += 8

    const waitlistTableData = waitlistPlayers.map((player, index) => [
      (index + 1).toString(),
      player.name,
      getProfileLabel(player.profile),
      player.rg || '-',
      player.phone || '-',
      player.isGuest
        ? player.invitedBy
          ? `Convidado por ${player.invitedBy.name}`
          : 'Convidado'
        : '-',
      new Date(player.joinTimestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Nome', 'Perfil', 'RG', 'Telefone', 'Convidado', 'Data']],
      body: waitlistTableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 37, 41], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 45 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      margin: { left: margin, right: margin },
    })

    yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // Lista de Resenha
  if (resenhaPlayers.length > 0) {
    // Verifica se precisa de nova página
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Lista de Resenha (${resenhaPlayers.length})`, margin, yPosition)
    yPosition += 8

    const resenhaTableData = resenhaPlayers.map((player, index) => [
      (index + 1).toString(),
      player.name,
      getProfileLabel(player.profile),
      player.rg || '-',
      player.phone || '-',
      player.isGuest
        ? player.invitedBy
          ? `Convidado por ${player.invitedBy.name}`
          : 'Convidado'
        : '-',
      new Date(player.joinTimestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Nome', 'Perfil', 'RG', 'Telefone', 'Convidado', 'Data']],
      body: resenhaTableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 37, 41], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 45 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      margin: { left: margin, right: margin },
    })
  }

  // Salva o PDF
  const fileName = `lista-jogadores-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

