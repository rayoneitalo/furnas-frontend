export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Furnas - Esquerda */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground"> */}
                {/* <span className="font-bold text-sm">F</span> */}
              {/* </div> */}
              <span className="font-bold text-xl">Furnas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema de gerenciamento de lista de jogadores com suporte a convites e lista de espera.
            </p>
          </div>

          {/* Informações - Direita */}
          <div className="space-y-2 flex-1 md:text-right">
            <h3 className="text-sm font-semibold">Informações</h3>
            <p className="text-sm text-muted-foreground">
              Janela de convites: Terça 00:00 - Quinta 14:00
            </p>
            <p className="text-sm text-muted-foreground">
              Capacidade máxima: 30 jogadores
            </p>
          </div>
        </div>

        {/* Versão e Direitos */}
        <div className="mt-8 border-t pt-6 px-4 md:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Versão 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Furnas. Todos os direitos reservados.
          </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

