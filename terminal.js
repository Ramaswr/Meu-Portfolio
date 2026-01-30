/*
  terminal.js — Documentação resumida (PT-BR)

  Função: controla o terminal interativo no cabeçalho do portfólio.

  Principais responsabilidades:
  - Inicializa a interface do terminal e manipula eventos (abrir, fechar, pausar, replay)
  - Suporta comandos simulados: ls, cd, ifconfig/ipconfig, clear/cls, exit, curl, cmatrix, help/ajuda, whoami/profile/perfil, projects/projetos, contact/contato, scripts, cat
  - Animação 'curl' / 'cmatrix' em canvas (efeito Matrix horizontal) com som curto (configurável)
  - Detecta idioma por IP para saudação localizada e mostra um texto no canto
  - Persistência: preferência de ocultar terminal e configurações de som em localStorage

  Uso rápido:
  - Para ajustar som: ver variáveis soundVolume / soundIntensity no topo do arquivo
  - Para editar comandos: procurar 'runCommand' dentro deste arquivo

  Observações:
  - O script é carregado com defer e espera o DOM (DOMContentLoaded) para inicializar
  - Comentários e textos de exibição estão em Português onde aplicável
*/

document.addEventListener('DOMContentLoaded', () => {
  const linesEl = document.getElementById('terminal-lines');
  const timestampEl = document.getElementById('terminal-timestamp');
  const badgeTimeEl = document.getElementById('badge-time');
  const replayBtn = document.getElementById('terminal-replay');
  const pauseBtn = document.getElementById('terminal-pause');
  const hideBtn = document.getElementById('terminal-hide');
  const toggleVisibilityBtn = document.getElementById('toggle-terminal-visibility');
  const terminalEl = document.querySelector('.terminal');
  const cornerNote = document.getElementById('corner-note');

  const openBtn = document.getElementById('terminal-open');
  const closedMessage = document.getElementById('terminal-closed-message');
  const promptRow = document.getElementById('terminal-prompt-row');
  const promptSpan = document.getElementById('terminal-prompt');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');

  // Exemplo de saída (como ls -la)
  const output = [
    'total 48',
    'drwxr-xr-x 1 root root  484 jan 15 09:57 .',
    'drwxr-xr-x 1 root root  250 jan 10 13:56 ..',
    '-rw------- 1 root root 7823 jan 16 11:43 .bash_history',
    '-rwx------ 1 root root 4925 jan  2 13:12 .bashrc',
    '-rw-r--r-- 1 root root    5 jan  2 23:34 bettercap.history',
    'drwxr-xr-x 1 root root   48 jan 10 11:26 .BurpSuite',
    "drwx------ 1 root root  182 jan 10 13:38 .cache",
  ];

  const commandCatalog = [
    { name: 'help/ajuda', description: 'Lista comandos disponíveis' },
    { name: 'ls/dir', description: 'Mostra os arquivos simulados' },
    { name: 'cd', description: 'Muda o diretório atual' },
    { name: 'ifconfig/ipconfig', description: 'Exibe o IP público' },
    { name: 'curl', description: 'Ativa o efeito Matrix com som' },
    { name: 'cmatrix', description: 'Efeito Matrix prolongado' },
    { name: 'clear/cls', description: 'Limpa o terminal e a animação' },
    { name: 'exit', description: 'Oculta o terminal' },
    { name: 'whoami/profile/perfil', description: 'Mostra meu perfil e foco profissional' },
    { name: 'projects/projetos', description: 'Resumo dos projetos em destaque' },
    { name: 'contact/contato', description: 'Formas de contato e WhatsApp' },
    { name: 'scripts', description: 'Lista os scripts forenses que podem ser abertos com cat' },
  ];

  const scriptLibrary = {
      'forensics-linux': {
        title: 'collect_forensics_linux.sh',
        description: 'Coleta informações forenses básicas em Linux.',
        aliases: ['collect_forensics_linux.sh', 'collect_forensics_linux'],
        content: `#!/bin/bash
  # collect_forensics_linux.sh
  # Coleta informações para análise forense. Somente leitura por padrão.

  set -euo pipefail
  TS=$(date +"%Y-%m-%d_%H-%M-%S")
  OUTDIR="/tmp/forensics_\${TS}"
  mkdir -p "$OUTDIR"

  echo "Output em $OUTDIR"

  # Informações básicas
  uname -a > "$OUTDIR/uname.txt"
  hostnamectl > "$OUTDIR/hostnamectl.txt" 2>/dev/null || true
  cat /etc/os-release > "$OUTDIR/os_release.txt" 2>/dev/null || true
  uptime > "$OUTDIR/uptime.txt"
  who -a > "$OUTDIR/who.txt"
  last -n 50 > "$OUTDIR/last.txt" 2>/dev/null || true

  # Processos e serviços
  ps aux --sort=-%cpu | head -n 200 > "$OUTDIR/ps_top_cpu.txt"
  ps aux --sort=-%mem | head -n 200 > "$OUTDIR/ps_top_mem.txt"
  ss -tunap > "$OUTDIR/ss_all.txt" 2>/dev/null || netstat -tunap > "$OUTDIR/netstat_all.txt" 2>/dev/null || true
  lsof -nP -i > "$OUTDIR/lsof_network.txt" 2>/dev/null || true
  systemctl list-units --type=service --all > "$OUTDIR/systemd_services.txt" 2>/dev/null || service --status-all > "$OUTDIR/services_list.txt" 2>/dev/null || true

  # Conexões e tabelas
  netstat -ano > "$OUTDIR/netstat_ano.txt" 2>/dev/null || true
  ip addr show > "$OUTDIR/ip_addr.txt"
  ip route show > "$OUTDIR/ip_route.txt"
  arp -a > "$OUTDIR/arp.txt"

  # Usuários e permissões
  getent passwd > "$OUTDIR/passwd.txt"
  getent group > "$OUTDIR/group.txt"
  cat /etc/sudoers > "$OUTDIR/sudoers.txt" 2>/dev/null || true
  ls -la /home > "$OUTDIR/home_list.txt" 2>/dev/null || true

  # Tarefas agendadas e inicialização
  crontab -l > "$OUTDIR/crontab_current.txt" 2>/dev/null || true
  ls -la /etc/cron* > "$OUTDIR/cron_dirs.txt" 2>/dev/null || true
  systemctl list-timers --all > "$OUTDIR/systemd_timers.txt" 2>/dev/null || true
  ls -la /etc/init.d > "$OUTDIR/initd_list.txt" 2>/dev/null || true

  # Arquivos executáveis recentes e SUID/SGID
  find /home /tmp /var/tmp -type f -mtime -7 -perm /111 -ls > "$OUTDIR/executables_recent.txt" 2>/dev/null || true
  find / -type f -perm -4000 -o -perm -2000 -ls > "$OUTDIR/suid_sgid_files.txt" 2>/dev/null || true

  # Logs
  if command -v journalctl >/dev/null 2>&1; then
    journalctl -n 500 --no-pager > "$OUTDIR/journal_recent.txt" 2>/dev/null || true
  fi
  cp -r /var/log "$OUTDIR/var_log" 2>/dev/null || true

  # Módulos e kernel
  lsmod > "$OUTDIR/lsmod.txt" 2>/dev/null || true
  dmesg | tail -n 200 > "$OUTDIR/dmesg_tail.txt" 2>/dev/null || true

  # Pacotes instalados
  if command -v dpkg >/dev/null 2>&1; then
    dpkg -l > "$OUTDIR/dpkg_list.txt" 2>/dev/null || true
  elif command -v rpm >/dev/null 2>&1; then
    rpm -qa > "$OUTDIR/rpm_list.txt" 2>/dev/null || true
  fi

  # Hashes de arquivos listados (limitar para evitar travar)
  HASHLIST="$OUTDIR/file_list_for_hash.txt"
  find /home /tmp /var/tmp -type f -iname "*.sh" -o -iname "*.py" -o -iname "*.pl" -o -iname "*.bin" -o -iname "*.exe" -mtime -90 -print > "$HASHLIST" 2>/dev/null || true
  head -n 200 "$HASHLIST" | while read -r f; do
    if [ -f "$f" ]; then
      sha256sum "$f" >> "$OUTDIR/file_hashes_sha256.txt" 2>/dev/null || shasum -a 256 "$f" >> "$OUTDIR/file_hashes_sha256.txt" 2>/dev/null || true
    fi
  done

  # Rootkit scanners se instalados (apenas leitura)
  if command -v chkrootkit >/dev/null 2>&1; then
    chkrootkit > "$OUTDIR/chkrootkit.txt" 2>/dev/null || true
  fi
  if command -v rkhunter >/dev/null 2>&1; then
    rkhunter --check --sk --rwo > "$OUTDIR/rkhunter.txt" 2>/dev/null || true
  fi

  # Antivirus scan opcional (pode demorar)
  if command -v clamscan >/dev/null 2>&1; then
    clamscan -r --bell -i / > "$OUTDIR/clamscan_root.txt" 2>/dev/null || true
  fi

  # Captura de pacotes opcional (descomente se quiser e tiver espaço)
  # sudo tcpdump -i any -nn -s 0 -w "$OUTDIR/capture.pcap" -c 10000

  # Resumo final
  echo "Coleta concluida em $OUTDIR"
  echo "Arquivos gerados:"
  ls -1 "$OUTDIR" | sed -n '1,200p'
  `
      },
      'forensics-macos': {
        title: 'collect_forensics_macos.sh',
        description: 'Coleta informações forenses em macOS.',
        aliases: ['collect_forensics_macos.sh', 'collect_forensics_macos'],
        content: `#!/bin/bash
  # collect_forensics_macos.sh
  # Coleta informações para análise em macOS. Somente leitura.

  set -euo pipefail
  TS=$(date +"%Y-%m-%d_%H-%M-%S")
  OUTDIR="/tmp/forensics_macos_\${TS}"
  mkdir -p "$OUTDIR"

  echo "Output em $OUTDIR"

  # Sistema e hardware
  sw_vers > "$OUTDIR/sw_vers.txt"
  uname -a > "$OUTDIR/uname.txt"
  system_profiler SPSoftwareDataType > "$OUTDIR/system_profiler_software.txt" 2>/dev/null || true
  system_profiler SPHardwareDataType > "$OUTDIR/system_profiler_hardware.txt" 2>/dev/null || true

  # Usuários e logins
  who > "$OUTDIR/who.txt"
  last -n 50 > "$OUTDIR/last.txt" 2>/dev/null || true
  dscl . -list /Users > "$OUTDIR/users_list.txt" 2>/dev/null || true

  # Processos e rede
  ps aux | sort -nrk 3,3 | head -n 200 > "$OUTDIR/ps_top_cpu.txt"
  lsof -nP -i > "$OUTDIR/lsof_network.txt" 2>/dev/null || true
  netstat -anv > "$OUTDIR/netstat_anv.txt" 2>/dev/null || true

  # Launchd, cron e itens de inicialização
  launchctl list > "$OUTDIR/launchctl_list.txt" 2>/dev/null || true
  crontab -l > "$OUTDIR/crontab.txt" 2>/dev/null || true
  ls -la /Library/LaunchAgents /Library/LaunchDaemons ~/Library/LaunchAgents /System/Library/LaunchDaemons > "$OUTDIR/launchd_dirs.txt" 2>/dev/null || true

  # Arquivos executáveis recentes e SUID/SGID
  find /Users /tmp -type f -mtime -30 -perm +111 -ls > "$OUTDIR/executables_recent.txt" 2>/dev/null || true
  find / -type f -perm -4000 -o -perm -2000 -ls > "$OUTDIR/suid_sgid_files.txt" 2>/dev/null || true

  # Logs
  log show --last 24h > "$OUTDIR/log_last_24h.txt" 2>/dev/null || true
  cp -r /var/log "$OUTDIR/var_log" 2>/dev/null || true

  # Homebrew packages se instalado
  if command -v brew >/dev/null 2>&1; then
    brew list --versions > "$OUTDIR/brew_list.txt" 2>/dev/null || true
  fi

  # Hashes de arquivos listados (limitar)
  HASHLIST="$OUTDIR/file_list_for_hash.txt"
  find /Users /tmp -type f -iname "*.sh" -o -iname "*.py" -o -iname "*.pl" -mtime -90 -print > "$HASHLIST" 2>/dev/null || true
  head -n 200 "$HASHLIST" | while read -r f; do
    if [ -f "$f" ]; then
      shasum -a 256 "$f" >> "$OUTDIR/file_hashes_sha256.txt" 2>/dev/null || true
    fi
  done

  # Rootkit / scanners se instalados
  if command -v rkhunter >/dev/null 2>&1; then
    rkhunter --check --sk --rwo > "$OUTDIR/rkhunter.txt" 2>/dev/null || true
  fi
  if command -v clamscan >/dev/null 2>&1; then
    clamscan -r --bell -i / > "$OUTDIR/clamscan_root.txt" 2>/dev/null || true
  fi

  # Captura de pacotes opcional (descomente se quiser)
  # sudo tcpdump -i any -nn -s 0 -w "$OUTDIR/capture.pcap" -c 10000

  echo "Coleta concluida em $OUTDIR"
  ls -1 "$OUTDIR" | sed -n '1,200p'
  `
      },
      'forensics-linux-zip': {
        title: 'collect_forensics_linux_zip.sh',
        description: 'Coleta dados em Linux e compacta em ZIP.',
        aliases: ['collect_forensics_linux_zip.sh', 'collect_forensics_linux_zip'],
        content: `#!/bin/bash
  # collect_forensics_linux_zip.sh
  # Coleta informações para análise forense e compacta em ZIP. Somente leitura.

  set -euo pipefail
  TS=$(date +"%Y-%m-%d_%H-%M-%S")
  OUTDIR="/tmp/forensics_\${TS}"
  ZIPFILE="/tmp/forensics_\${TS}.zip"
  mkdir -p "$OUTDIR"

  echo "Iniciando coleta em $OUTDIR"

  # Informações básicas
  uname -a > "$OUTDIR/uname.txt"
  hostnamectl > "$OUTDIR/hostnamectl.txt" 2>/dev/null || true
  cat /etc/os-release > "$OUTDIR/os_release.txt" 2>/dev/null || true
  uptime > "$OUTDIR/uptime.txt"
  who -a > "$OUTDIR/who.txt"
  last -n 50 > "$OUTDIR/last.txt" 2>/dev/null || true

  # Processos e serviços
  ps aux --sort=-%cpu | head -n 200 > "$OUTDIR/ps_top_cpu.txt"
  ps aux --sort=-%mem | head -n 200 > "$OUTDIR/ps_top_mem.txt"
  ss -tunap > "$OUTDIR/ss_all.txt" 2>/dev/null || netstat -tunap > "$OUTDIR/netstat_all.txt" 2>/dev/null || true
  lsof -nP -i > "$OUTDIR/lsof_network.txt" 2>/dev/null || true
  systemctl list-units --type=service --all > "$OUTDIR/systemd_services.txt" 2>/dev/null || service --status-all > "$OUTDIR/services_list.txt" 2>/dev/null || true

  # Conexões e tabelas
  netstat -ano > "$OUTDIR/netstat_ano.txt" 2>/dev/null || true
  ip addr show > "$OUTDIR/ip_addr.txt"
  ip route show > "$OUTDIR/ip_route.txt"
  arp -a > "$OUTDIR/arp.txt"

  # Usuários e permissões
  getent passwd > "$OUTDIR/passwd.txt"
  getent group > "$OUTDIR/group.txt"
  cat /etc/sudoers > "$OUTDIR/sudoers.txt" 2>/dev/null || true
  ls -la /home > "$OUTDIR/home_list.txt" 2>/dev/null || true

  # Tarefas agendadas e inicialização
  crontab -l > "$OUTDIR/crontab_current.txt" 2>/dev/null || true
  ls -la /etc/cron* > "$OUTDIR/cron_dirs.txt" 2>/dev/null || true
  systemctl list-timers --all > "$OUTDIR/systemd_timers.txt" 2>/dev/null || true
  ls -la /etc/init.d > "$OUTDIR/initd_list.txt" 2>/dev/null || true

  # Arquivos executáveis recentes e SUID/SGID
  find /home /tmp /var/tmp -type f -mtime -7 -perm /111 -ls > "$OUTDIR/executables_recent.txt" 2>/dev/null || true
  find / -type f -perm -4000 -o -perm -2000 -ls > "$OUTDIR/suid_sgid_files.txt" 2>/dev/null || true

  # Logs
  if command -v journalctl >/dev/null 2>&1; then
    journalctl -n 500 --no-pager > "$OUTDIR/journal_recent.txt" 2>/dev/null || true
  fi
  cp -r /var/log "$OUTDIR/var_log" 2>/dev/null || true

  # Módulos e kernel
  lsmod > "$OUTDIR/lsmod.txt" 2>/dev/null || true
  dmesg | tail -n 200 > "$OUTDIR/dmesg_tail.txt" 2>/dev/null || true

  # Pacotes instalados
  if command -v dpkg >/dev/null 2>&1; then
    dpkg -l > "$OUTDIR/dpkg_list.txt" 2>/dev/null || true
  elif command -v rpm >/dev/null 2>&1; then
    rpm -qa > "$OUTDIR/rpm_list.txt" 2>/dev/null || true
  fi

  # Hashes limitados
  HASHLIST="$OUTDIR/file_list_for_hash.txt"
  find /home /tmp /var/tmp -type f \( -iname "*.sh" -o -iname "*.py" -o -iname "*.pl" -o -iname "*.bin" -o -iname "*.exe" \) -mtime -90 -print > "$HASHLIST" 2>/dev/null || true
  head -n 200 "$HASHLIST" | while read -r f; do
    [ -f "$f" ] || continue
    sha256sum "$f" >> "$OUTDIR/file_hashes_sha256.txt" 2>/dev/null || true
  done

  # Rootkit scanners se instalados
  if command -v chkrootkit >/dev/null 2>&1; then
    chkrootkit > "$OUTDIR/chkrootkit.txt" 2>/dev/null || true
  fi
  if command -v rkhunter >/dev/null 2>&1; then
    rkhunter --check --sk --rwo > "$OUTDIR/rkhunter.txt" 2>/dev/null || true
  fi

  # Antivirus opcional
  if command -v clamscan >/dev/null 2>&1; then
    clamscan -r --bell -i / > "$OUTDIR/clamscan_root.txt" 2>/dev/null || true
  fi

  # Compactar em ZIP e gerar checksum SHA256
  echo "Compactando resultados em $ZIPFILE"
  cd /tmp
  zip -r -q "$ZIPFILE" "$(basename "$OUTDIR")"
  shasum -a 256 "$ZIPFILE" > "\${ZIPFILE}.sha256"

  echo "Coleta concluida. ZIP em $ZIPFILE"
  ls -lh "$ZIPFILE" "\${ZIPFILE}.sha256"
  `
      },
      'forensics-linux-home': {
        title: 'collect_forensics_linux_home.sh',
        description: 'Coleta forense em Linux salvando em $HOME.',
        aliases: ['collect_forensics_linux_home.sh', 'collect_forensics_linux_home'],
        content: `#!/bin/bash
  # collect_forensics_linux_home.sh
  # Coleta forense somente leitura e salva em $HOME/Forensics_<timestamp>

  set -euo pipefail
  TS=$(date +"%Y-%m-%d_%H-%M-%S")
  OUTDIR="$HOME/Forensics_\${TS}"
  ZIPFILE="$HOME/forensics_\${TS}.zip"
  mkdir -p "$OUTDIR"

  echo "Iniciando coleta em $OUTDIR"

  # Informações básicas
  uname -a > "$OUTDIR/uname.txt" 2>/dev/null || true
  hostnamectl > "$OUTDIR/hostnamectl.txt" 2>/dev/null || true
  cat /etc/os-release > "$OUTDIR/os_release.txt" 2>/dev/null || true
  uptime > "$OUTDIR/uptime.txt" 2>/dev/null || true
  who -a > "$OUTDIR/who.txt" 2>/dev/null || true
  last -n 50 > "$OUTDIR/last.txt" 2>/dev/null || true

  # Processos e serviços
  ps aux --sort=-%cpu | head -n 200 > "$OUTDIR/ps_top_cpu.txt" 2>/dev/null || true
  ps aux --sort=-%mem | head -n 200 > "$OUTDIR/ps_top_mem.txt" 2>/dev/null || true
  if command -v ss >/dev/null 2>&1; then
    ss -tunap > "$OUTDIR/ss_all.txt" 2>/dev/null || true
  else
    netstat -tunap > "$OUTDIR/netstat_all.txt" 2>/dev/null || true
  fi
  lsof -nP -i > "$OUTDIR/lsof_network.txt" 2>/dev/null || true
  if command -v systemctl >/dev/null 2>&1; then
    systemctl list-units --type=service --all > "$OUTDIR/systemd_services.txt" 2>/dev/null || true
  else
    service --status-all > "$OUTDIR/services_list.txt" 2>/dev/null || true
  fi

  # Rede e tabelas
  ip addr show > "$OUTDIR/ip_addr.txt" 2>/dev/null || true
  ip route show > "$OUTDIR/ip_route.txt" 2>/dev/null || true
  arp -a > "$OUTDIR/arp.txt" 2>/dev/null || true
  netstat -ano > "$OUTDIR/netstat_ano.txt" 2>/dev/null || true

  # Usuários e permissões
  getent passwd > "$OUTDIR/passwd.txt" 2>/dev/null || true
  getent group > "$OUTDIR/group.txt" 2>/dev/null || true
  cat /etc/sudoers > "$OUTDIR/sudoers.txt" 2>/dev/null || true
  ls -la /home > "$OUTDIR/home_list.txt" 2>/dev/null || true

  # Tarefas agendadas e inicialização
  crontab -l > "$OUTDIR/crontab_current.txt" 2>/dev/null || true
  ls -la /etc/cron* > "$OUTDIR/cron_dirs.txt" 2>/dev/null || true
  if command -v systemctl >/dev/null 2>&1; then
    systemctl list-timers --all > "$OUTDIR/systemd_timers.txt" 2>/dev/null || true
  fi
  ls -la /etc/init.d > "$OUTDIR/initd_list.txt" 2>/dev/null || true

  # Arquivos executáveis recentes e SUID/SGID
  find /home /tmp /var/tmp -type f -mtime -7 -perm /111 -ls > "$OUTDIR/executables_recent.txt" 2>/dev/null || true
  find / -type f -perm -4000 -o -perm -2000 -ls > "$OUTDIR/suid_sgid_files.txt" 2>/dev/null || true

  # Logs
  if command -v journalctl >/dev/null 2>&1; then
    journalctl -n 500 --no-pager > "$OUTDIR/journal_recent.txt" 2>/dev/null || true
  fi
  cp -r /var/log "$OUTDIR/var_log" 2>/dev/null || true

  # Módulos e kernel
  lsmod > "$OUTDIR/lsmod.txt" 2>/dev/null || true
  dmesg | tail -n 200 > "$OUTDIR/dmesg_tail.txt" 2>/dev/null || true

  # Pacotes instalados
  if command -v dpkg >/dev/null 2>&1; then
    dpkg -l > "$OUTDIR/dpkg_list.txt" 2>/dev/null || true
  elif command -v rpm >/dev/null 2>&1; then
    rpm -qa > "$OUTDIR/rpm_list.txt" 2>/dev/null || true
  fi

  # Hashes limitados
  HASHLIST="$OUTDIR/file_list_for_hash.txt"
  find /home /tmp /var/tmp -type f \( -iname "*.sh" -o -iname "*.py" -o -iname "*.pl" -o -iname "*.bin" -o -iname "*.exe" \) -mtime -90 -print > "$HASHLIST" 2>/dev/null || true
  head -n 200 "$HASHLIST" | while read -r f; do
    [ -f "$f" ] || continue
    sha256sum "$f" >> "$OUTDIR/file_hashes_sha256.txt" 2>/dev/null || true
  done

  # Rootkit scanners se instalados
  if command -v chkrootkit >/dev/null 2>&1; then
    chkrootkit > "$OUTDIR/chkrootkit.txt" 2>/dev/null || true
  fi
  if command -v rkhunter >/dev/null 2>&1; then
    rkhunter --check --sk --rwo > "$OUTDIR/rkhunter.txt" 2>/dev/null || true
  fi

  # Antivirus opcional
  if command -v clamscan >/dev/null 2>&1; then
    clamscan -r --bell -i / > "$OUTDIR/clamscan_root.txt" 2>/dev/null || true
  fi

  # Compactar em ZIP e gerar checksum SHA256
  echo "Compactando resultados em $ZIPFILE"
  cd "$HOME"
  zip -r -q "$ZIPFILE" "$(basename "$OUTDIR")"
  sha256sum "$ZIPFILE" > "\${ZIPFILE}.sha256" 2>/dev/null || true

  echo "Coleta concluida. ZIP em $ZIPFILE"
  ls -lh "$ZIPFILE" "\${ZIPFILE}.sha256" 2>/dev/null || true
  `
      },
      'block-ip-ps1': {
        title: 'block-ip.ps1',
        description: 'Powershell para bloquear IPs no firewall.',
        aliases: ['block-ip.ps1', 'block-ip-ps1', 'block-ip'],
        content: `# block-ip.ps1
  param(
    [Parameter(Mandatory=$true)][string[]]$IPs,
    [string]$Action = "Block", # Block or Allow
    [string]$Direction = "Inbound" # Inbound or Outbound
  )

  $ts = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
  $log = "$env:USERPROFILE\\Forensics_firewall_$ts.log"

  foreach ($ip in $IPs) {
    $name = "AutoBlock_$($ip)_$ts"
    if ($Action -eq "Block") {
      New-NetFirewallRule -DisplayName $name -Direction $Direction -Action Block -RemoteAddress $ip -Description "Blocked by script on $ts" -ErrorAction SilentlyContinue
      "$((Get-Date).ToString()) - ADDED rule $name for $ip" | Out-File -FilePath $log -Append
    } else {
      New-NetFirewallRule -DisplayName $name -Direction $Direction -Action Allow -RemoteAddress $ip -ErrorAction SilentlyContinue
      "$((Get-Date).ToString()) - ADDED allow rule $name for $ip" | Out-File -FilePath $log -Append
    }
  }

  # Listar regras criadas
  Get-NetFirewallRule -DisplayName "AutoBlock_*" | Select-Object DisplayName,Direction,Action,RemoteAddress | Format-Table | Out-String | Out-File -FilePath $log -Append

  # Compactar script e log em ZIP (opcional)
  $zip = "$env:USERPROFILE\\firewall_block_$ts.zip"
  Compress-Archive -Path $log, $MyInvocation.MyCommand.Path -DestinationPath $zip -Force
  Write-Output "ZIP criado: $zip"
  `
      },
      'block-ip-bat': {
        title: 'block-ip.bat',
        description: 'Batch para bloquear IPs usando netsh.',
        aliases: ['block-ip.bat', 'block-ip-bat'],
        content: `@echo off
  REM block-ip.bat
  REM Uso: block-ip.bat 1.2.3.4 203.0.113.0/24

  set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%-%TIME:~3,2%
  set OUT=%USERPROFILE%\\firewall_block_%TIMESTAMP%
  mkdir "%OUT%"
  for %%I in (%*) do (
    netsh advfirewall firewall add rule name="AutoBlock_%%I_%TIMESTAMP%" dir=in action=block remoteip=%%I
    echo %DATE% %TIME% - Blocked %%I >> "%OUT%\\actions.log"
  )
  powershell -Command "Compress-Archive -Path '%OUT%' -DestinationPath '%OUT%.zip' -Force"
  echo ZIP criado: %OUT%.zip
  pause
  `
      }
};

const scriptKeys = Object.keys(scriptLibrary);

const terminalApiBase = window.TERMINAL_API_BASE || document.documentElement.dataset.terminalApiBase || '';
const terminalApiTimeoutMs = 4500;

function buildBackendUrl() {
  if (!terminalApiBase) return '';
  return terminalApiBase.replace(/\/+$/,'') + '/api/terminal';
}

async function queryTerminalBackend(command) {
  const backendUrl = buildBackendUrl();
  if (!backendUrl) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), terminalApiTimeoutMs);
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))).detail || response.statusText;
      return { error: `API: ${detail}` };
    }
    const data = await response.json().catch(() => ({}));
    if (Array.isArray(data.lines)) {
      return { lines: data.lines };
    }
    return { error: 'Resposta inválida do backend' };
  } catch (error) {
    clearTimeout(timeoutId);
    return { error: 'Backend inacessível' };
  }
}

  function resolveScriptKey(token) {
    if (!token) return null;
    const lowered = token.toLowerCase();
    const normalized = lowered.replace(/\.(sh|ps1|bat)$/i, '').replace(/[\s_]+/g, '-');
    if (scriptLibrary[normalized]) return normalized;
    for (const [key, entry] of Object.entries(scriptLibrary)) {
      if (entry.title.toLowerCase() === lowered || (entry.aliases || []).includes(lowered) || (entry.aliases || []).includes(normalized)) {
        return key;
      }
    }
    return null;
  }

  function appendScriptContent(entry) {
    appendLine(`--- ${entry.title} ---`);
    entry.content.split('\n').forEach(line => appendLine(line));
    appendLine(`--- fim ${entry.title} ---`);
  }

  function formatNow() {
    const now = new Date();
    return now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  function setBadgeTime() {
    if (badgeTimeEl) badgeTimeEl.textContent = formatNow();
  }

  // estado
  let paused = false;
  let hidden = false;
  let opened = false;
  let welcomed = false;
  let currentPath = '~';
  let shellType = /Win/.test(navigator.platform) || /Windows/.test(navigator.userAgent) ? 'powershell' : 'bash';

  function appendLine(text = '') {
    if (!linesEl) return;
    linesEl.textContent += text + '\n';
    linesEl.scrollTop = linesEl.scrollHeight;
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function updatePrompt() {
    if (!promptSpan) return;
    if (shellType === 'powershell') {
      promptSpan.textContent = `PS C:\\${currentPath}>`;
    } else {
      promptSpan.textContent = `└──╼ ${currentPath} $`;
    }
  }

  async function runCommand(cmdRaw) {
    const cmd = (cmdRaw || '').trim();
    if (!cmd) return;
    appendLine(cmd);

    const parts = cmd.split(' ').filter(Boolean);
    const base = parts[0].toLowerCase();

    if (base === 'ls' || base === 'dir') {
      appendLine(`-- Saída em: ${formatNow()} --`);
      for (const line of output) appendLine(line);
      return;
    }

    if (base === 'cd') {
      const target = parts[1] || '~';
      if (target === '..' || target === '/') currentPath = '/'; else if (target === '~') currentPath = '~'; else currentPath = target.replace(/\//g, '');
      updatePrompt();
      appendLine(`Diretório agora: ${currentPath}`);
      return;
    }

    if (base === 'ifconfig' || base === 'ipconfig') {
      appendLine('Obtendo IP público...');
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        appendLine(shellType === 'powershell' ? `Endereço IPv4 : ${data.ip}` : `inet addr: ${data.ip}`);
      } catch (e) {
        appendLine('Erro ao recuperar IP');
      }
      return;
    }

    if (base === 'curl') {
      appendLine('curl: iniciando animação...');
      startCurlAnimation(6000); // demo
      return;
    }

    // instalar cmatrix (mensagem) ou rodar 'cmatrix' direto
    if (base === 'sudo' && parts.indexOf('cmatrix') !== -1) {
      appendLine('Para instalar cmatrix no seu sistema local rode: sudo apt -y install cmatrix');
      appendLine('Dica: digite `cmatrix` aqui para ver o efeito de matrix nesta página.');
      return;
    }
    if (base === 'cmatrix') {
      appendLine('cmatrix: iniciando efeito (local)...');
      startCurlAnimation(12000, { speedMultiplier: 2, intensityMultiplier: 1.5, chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!@#$%&*()-+=/\\|<>?[]{}~' });
      return;
    }

    if (base === 'clear' || base === 'cls') {
      stopCurlAnimation();
      // limpar as saídas e canvas
      if (linesEl) linesEl.textContent = '';
      const canvas = document.getElementById('matrix-canvas');
      if (canvas) { const ctx = canvas.getContext('2d'); ctx && ctx.clearRect(0,0,canvas.width,canvas.height); canvas.setAttribute('aria-hidden','true'); }
      // atualizar topline
      updatePrompt();
      return;
    }

    if (base === 'help' || base === 'ajuda' || base === 'commands') {
      appendLine('Comandos conhecidos:');
      for (const item of commandCatalog) {
        appendLine(`- ${item.name}: ${item.description}`);
      }
      return;
    }

    if (base === 'whoami' || base === 'profile' || base === 'perfil') {
      profileLines.forEach(line => appendLine(line));
      return;
    }

    if (base === 'projects' || base === 'projetos') {
      appendLine('Projetos em destaque:');
      for (const project of featuredProjects) {
        appendLine(`• ${project.title} — ${project.description}`);
        if (project.reference) appendLine(`  Referência: ${project.reference}`);
      }
      return;
    }

    if (base === 'contact' || base === 'contato' || base === 'whatsapp') {
      appendLine('Contato:');
      contactLines.forEach(line => appendLine(line));
      return;
    }

    if (base === 'scripts') {
      appendLine('Scripts demonstrativos disponíveis:');
      for (const key of scriptKeys) {
        const entry = scriptLibrary[key];
        appendLine(`- ${key}: ${entry.title} (${entry.description})`);
      }
      appendLine('Use cat <script> para visualizar o conteúdo.');
      return;
    }

    if (base === 'cat' || base === 'view') {
      const target = parts[1];
      if (!target) {
        appendLine('cat: uso: cat <script>. Digite scripts para ver as opções.');
        return;
      }
      const key = resolveScriptKey(target);
      if (!key) {
        appendLine(`cat: ${target}: arquivo não encontrado (digite scripts para a lista).`);
        return;
      }
      appendScriptContent(scriptLibrary[key]);
      return;
    }

    if (base === 'exit') {
      appendLine('Saindo do terminal...');
      stopCurlAnimation();
      setHidden(true);
      return;
    }

    const backendResult = await queryTerminalBackend(cmd);
    if (backendResult) {
      if (backendResult.lines && backendResult.lines.length) {
        backendResult.lines.forEach(line => appendLine(line));
        return;
      }
      if (backendResult.error) {
        appendLine(backendResult.error);
        return;
      }
    }

    appendLine(`${base}: comando não encontrado`);
  }

  function setHidden(val) {
    hidden = val;
    opened = !hidden;
    if (terminalEl) {
      terminalEl.classList.toggle('hidden', hidden);
    }
    try { localStorage.setItem('terminalHidden', hidden ? '1' : '0'); } catch (e) {}
    // show the open button when terminal is hidden
    if (closedMessage) closedMessage.hidden = !hidden;
    // show/hide prompt row
    if (promptRow) promptRow.hidden = hidden;
    // clear input if hiding
    if (hidden && input) { input.value = ''; input.blur(); }
    // stop animation when hiding
    if (hidden) stopCurlAnimation();
    updateButtons();
  }

  function updateButtons() {
    if (pauseBtn) {
      pauseBtn.textContent = paused ? 'Retomar' : 'Pausar';
      pauseBtn.setAttribute('aria-pressed', String(paused));
    }
    if (hideBtn) {
      hideBtn.textContent = hidden ? 'Mostrar' : 'Ocultar';
      hideBtn.setAttribute('aria-pressed', String(hidden));
    }
    if (toggleVisibilityBtn) {
      toggleVisibilityBtn.textContent = hidden ? 'Mostrar terminal' : 'Ocultar terminal';
      toggleVisibilityBtn.setAttribute('aria-pressed', String(hidden));
    }
  }

  // Abrir interface do terminal para interação
  function openTerminal() {
    if (opened) return;
    opened = true;
    if (closedMessage) closedMessage.hidden = true;
    if (promptRow) promptRow.hidden = false;
    updatePrompt();
    if (input) { input.value = ''; input.focus(); }
    setHidden(false);
    // print only the localized welcome message once per sessão
    if (!welcomed) {
      appendLine(`${localizedGreeting} — Bem-vindo ao meu portfólio.`);
      welcomed = true;
      if (timestampEl) timestampEl.textContent = formatNow();
      if (cornerNote) cornerNote.textContent = localizedGreeting + ' — Bem-vindo ao meu portfólio.';
    }

    // ensure header and prompt are visible in terminal (single display)
    try {
      const content = linesEl ? linesEl.textContent || '' : '';
      if (linesEl && !/┌─\[root@Jerr\]/.test(content)) {
        appendLine(`┌─[root@Jerr]─[${currentPath}]`);
      }
      if (linesEl && !/└──╼/.test(content)) {
        appendLine(`└──╼ ${currentPath} $`);
      }
    } catch (e) {}

  }

  // Animação 'curl' (estilo Matrix) com controle de som
  let curlInterval = null;
  let curlTimeout = null;
  let audioCtx = null;
  let audioGain = null;

  // more detailed ASCII art frames for the "dev" (bigger)
  const devFrames = [
`       _____
      /     \
     |  0 0 |
     |  \_/ |
     |  --- |   __
    /|_____|\  /  \
   /  /   \  \/ /\ \
  |  |     |   /  \/
  |  |  _  |  |  __  |
  |  | |_| |  | |  | |
  |  |_____|  |_|  |_|
   \________/  [==PC==]`,
`       _____
      / 0 0 \
     |  ~~~ |
     |  \_/ |
     |  --- |  /\
    /|_____|\ /  \
   /  /   \  Y /\ \
  |  |     | |/  \/
  |  |  _  |  /\__/
  |  | |_| | |  __|
  |  |_____| |_|   
   \________/ [==PC==]`
  ];

  // sound control state — moved to nav badge (outside terminal)
  let soundEnabled = true;
  let soundVolume = 0.02; // default bem baixo (0..1)
  let soundIntensity = 0.15; // probabilidade por stream (0..1)
  // Limitar o som da animação a uma janela curta (ms)
  let soundWindowStart = 0; // timestamp quando a animação iniciou o som
  const soundWindowDuration = 3000; // duração máxima do som em ms (3s)

  // caracteres alfanuméricos usados na Matrix (apenas letras e números)
  const matrixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Função auxiliar para reproduzir som curto ('bit drop'); volume e intensidade considerados
  function playBitSound() {
    try {
      if (!soundEnabled) return;
      // respeitar janela de som (apenas durante os primeiros 3s da animação)
      if (soundWindowStart && (performance.now() - soundWindowStart) > soundWindowDuration) return;
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioGain = audioCtx.createGain();
        audioGain.gain.value = soundVolume;
        audioGain.connect(audioCtx.destination);
      }
      // update gain in case volume changed
      audioGain.gain.value = soundVolume;

      const o = audioCtx.createOscillator();
      const f = audioCtx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 800 + Math.random() * 2200;
      o.type = 'sine';
      o.frequency.value = 400 + Math.random() * 1600;
      o.connect(f);
      f.connect(audioGain);
      o.start();
      const now = audioCtx.currentTime;
      audioGain.gain.cancelScheduledValues(now);
      audioGain.gain.setValueAtTime(soundVolume, now);
      audioGain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
      o.stop(now + 0.12);
    } catch (e) {
      // audio may be blocked — ignore silently
    }
  }

  // Canvas-based horizontal Matrix animation
  let matrixAnimId = null;
  function startCurlAnimation(duration = 7000) {
    stopCurlAnimation();
    const matrixArea = document.getElementById('matrix-area');
    let canvas = document.getElementById('matrix-canvas');
    if (!matrixArea) {
      appendLine('Erro: área de animação não encontrada.');
      return;
    }
    matrixArea.setAttribute('aria-hidden', 'false');

    // retry logic para casos onde elemento ainda não foi renderizado (tamanho 0)
    let attempts = 0;
    const maxAttempts = 12;
    let waitingMsgShown = false;

    function tryStart() {
      const rect = matrixArea.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) {
        attempts++;
        if (!waitingMsgShown) { appendLine('Aguardando renderização do terminal...'); waitingMsgShown = true; }
        if (attempts <= maxAttempts) {
          setTimeout(tryStart, 200);
          return;
        } else {
          appendLine('Erro: não foi possível inicializar a animação (área muito pequena).');
          return;
        }
      }

      try {
        // create canvas if missing (dynamic) — evita erro 'área não encontrada'
        if (!canvas) {
          const canvasEl = document.createElement('canvas');
          canvasEl.id = 'matrix-canvas';
          canvasEl.className = 'matrix-canvas';
          matrixArea.appendChild(canvasEl);
          canvas = canvasEl; // update outer reference
        }

        // size canvas to element (high-DPI aware)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // iniciar janela de som (3 segundos)
        soundWindowStart = performance.now();
        setTimeout(() => { soundWindowStart = 0; }, soundWindowDuration);
        // configuration
        const charSize = 14; // px
        const rows = Math.floor(rect.height / charSize);
        const cols = Math.floor(rect.width / (charSize * 0.6));
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!@#$%&*()-+=/\\|<>?[]{}~';

        // streams per row: each stream is an x position and a speed
        const streams = [];
        for (let r = 0; r < rows; r++) {
          streams.push({x: -Math.random() * rect.width, speed: 1 + Math.random() * 3, row: r});
        }

        function frame(now) {
          if (paused || hidden) { matrixAnimId = requestAnimationFrame(frame); return; }
          // clear
          ctx.clearRect(0, 0, rect.width, rect.height);
          ctx.fillStyle = '#00110a';
          ctx.fillRect(0, 0, rect.width, rect.height);

          // draw each row as a horizontal cascade (moving right)
          ctx.font = `${charSize}px "Fira Code", monospace`;
          for (let s = 0; s < streams.length; s++) {
            const st = streams[s];
            st.x += st.speed; // move to right
            // wrap
            if (st.x > rect.width + 50) st.x = -50 - Math.random() * 200;
            const length = 6 + Math.floor(Math.random() * 12);
            for (let k = 0; k < length; k++) {
              const posX = st.x - k * (charSize * 0.6);
              if (posX < -20 || posX > rect.width + 20) continue;
              const ch = chars.charAt(Math.floor(Math.random() * chars.length));
              const alpha = Math.max(0.08, 1 - k * 0.12);
              ctx.fillStyle = `rgba(0,255,102,${alpha})`;
              ctx.fillText(ch, posX, (st.row + 1) * charSize - 4);
            }
            // play sound synchronized with stream head occasionally or based on intensity
            if (soundEnabled && Math.random() < soundIntensity * 0.08) playBitSound();
          }

          matrixAnimId = requestAnimationFrame(frame);
        }

        matrixAnimId = requestAnimationFrame(frame);

        // end after duration
        curlTimeout = setTimeout(() => {
          stopCurlAnimation();
          // show finished note inside canvas
          ctx.clearRect(0,0,rect.width,rect.height);
          ctx.fillStyle = '#00110a'; ctx.fillRect(0,0,rect.width,rect.height);
          ctx.fillStyle = '#00ff66'; ctx.font = `${charSize}px "Fira Code", monospace`;
          ctx.fillText('-- animação finalizada --', 8, rect.height / dpr / 2);
          if (timestampEl) timestampEl.textContent = formatNow();
        }, duration);
      } catch (err) {
        appendLine('Erro ao iniciar a animação: ' + (err && err.message ? err.message : String(err)));
      }
    }

    tryStart();
  }

  function stopCurlAnimation() {
    if (matrixAnimId) { cancelAnimationFrame(matrixAnimId); matrixAnimId = null; }
    if (curlTimeout) { clearTimeout(curlTimeout); curlTimeout = null; }
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx && ctx.clearRect(0,0,canvas.width,canvas.height);
      canvas.setAttribute('aria-hidden','true');
    }
    // close audio and reset janela de som
    soundWindowStart = 0;
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null; audioGain = null;
    }
  }

  function stopCurlAnimation() {
    if (curlInterval) { clearInterval(curlInterval); curlInterval = null; }
    if (curlTimeout) { clearTimeout(curlTimeout); curlTimeout = null; }
    const matrixArea = document.getElementById('matrix-area');
    if (matrixArea) {
      matrixArea.innerHTML = '';
      matrixArea.setAttribute('aria-hidden', 'true');
    }
    // disconnect audio context if exists for cleanup
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
      audioGain = null;
    }
  }

  // restore preferences (hidden, sound)
  try {
    const pref = localStorage.getItem('terminalHidden');
    if (pref === '1') setHidden(true);
  } catch (e) {}

  try {
    const sPref = localStorage.getItem('terminalSoundEnabled');
    if (sPref === '0') soundEnabled = false;
    const vol = localStorage.getItem('terminalSoundVolume');
    if (vol != null) soundVolume = Number(vol);
    const intp = localStorage.getItem('terminalSoundIntensity');
    if (intp != null) soundIntensity = Number(intp);
  } catch (e) {}

  // Tradução/localização da mensagem de canto (por país/idioma)
  let localizedGreeting = 'Hola!_yo_Soy_Jerr';
  const translations = {
    es: 'Hola!_yo_Soy_Jerr',
    pt: 'Olá!_eu_Sou_Jerr',
    en: 'Hello!_I_am_Jerr',
    zh: '你好！我是Jerr',
    ru: 'Привет!_Я_Jerr',
    fr: 'Bonjour!_Je_Suis_Jerr',
    de: 'Hallo!_Ich_Bin_Jerr'
  };

  async function detectVisitorLocale() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const langs = (data.languages || '').split(',');
      if (langs.length) {
        const lang = langs[0].slice(0,2).toLowerCase();
        if (translations[lang]) { localizedGreeting = translations[lang]; return; }
      }
      const cc = (data.country_code || '').toLowerCase();
      if (cc && translations[cc]) { localizedGreeting = translations[cc]; return; }
    } catch (e) {
      // fallback to navigator language
      const nav = (navigator.language || navigator.userLanguage || 'en').slice(0,2).toLowerCase();
      if (translations[nav]) localizedGreeting = translations[nav];
    }
  }

  // apply localized message to corner
  async function applyLocalizedGreeting() {
    await detectVisitorLocale();
    if (cornerNote) cornerNote.textContent = localizedGreeting + ' — Bem-vindo ao meu portfólio.';
  }

  // wire sound control via nav badge
  const navSoundToggle = document.getElementById('nav-sound-toggle');
  function updateSoundUI() {
    if (navSoundToggle) {
      navSoundToggle.setAttribute('aria-pressed', String(soundEnabled));
      navSoundToggle.textContent = soundEnabled ? '🔊' : '🔈';
    }
  }

  if (navSoundToggle) navSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    try { localStorage.setItem('terminalSoundEnabled', soundEnabled ? '1' : '0'); } catch (e) {}
    updateSoundUI();
  });

  // load persisted sound settings (volume/intensity still persisted but UI removed)
  try {
    const sPref = localStorage.getItem('terminalSoundEnabled');
    if (sPref === '0') soundEnabled = false;
    const vol = localStorage.getItem('terminalSoundVolume');
    if (vol != null) soundVolume = Number(vol);
    const intp = localStorage.getItem('terminalSoundIntensity');
    if (intp != null) soundIntensity = Number(intp);
  } catch (e) {}

  updateSoundUI();

  // Enviar WhatsApp (mover função para aqui, desativada por padrão)
  const ENABLE_WHATS = false; // definir true se quiser ativar o envio a partir do formulário

  function enviarWhats(event) {
    event.preventDefault();
    const nome = document.getElementById('nome')?.value.trim() || '';
    const mensagem = document.getElementById('mensagem')?.value.trim() || '';
    const telefone = '5592985162222';

    if (!nome && !mensagem) {
      alert('Por favor, preencha o nome ou a mensagem antes de enviar.');
      return;
    }

    const texto = `Olá, me chamo ${nome || 'Jesus Rama'}. ${mensagem}`;
    const msgFormatada = encodeURIComponent(texto);
    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;
    window.open(url, '_blank');
  }

  // Anexar handler ao formulário apenas quando habilitado
  if (ENABLE_WHATS) {
    const contatoForm = document.getElementById('formulario');
    if (contatoForm) contatoForm.addEventListener('submit', enviarWhats);
  }

  // aplicar saudação localizada e inicializar UI
  applyLocalizedGreeting();
  setBadgeTime();
  updatePrompt();
  updateButtons();

  // Events
  if (openBtn) openBtn.addEventListener('click', openTerminal);

  if (form && input) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const val = input.value;
      input.value = '';
      await runCommand(val);
      // refocus
      input.focus();
    });
  }

  if (replayBtn) replayBtn.addEventListener('click', () => {
    // replay previous or a demo: show ls -la once
    if (hidden) return;
    (async () => { await runCommand('ls -la'); })();
  });

  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    paused = !paused;
    updateButtons();
  });

  if (hideBtn) hideBtn.addEventListener('click', () => {
    setHidden(!hidden);
  });

  if (toggleVisibilityBtn) toggleVisibilityBtn.addEventListener('click', () => {
    setHidden(!hidden);
  });

  // bindings: copy cmatrix, run curl/cm, and update topline
  const toplineEl = document.getElementById('terminal-topline');
  const runCurlBtn = document.getElementById('run-curl');
  const runCmatrixSuggestBtn = document.getElementById('run-cmatrix-suggest');
  function updateTopline() {
    if (toplineEl) toplineEl.textContent = `┌─[root@Jerr]─[${currentPath}]`;
  }



  if (runCurlBtn) runCurlBtn.addEventListener('click', () => {
    openTerminal();
    appendLine('curl');
    startCurlAnimation(7000);
  });

  if (runCmatrixSuggestBtn) runCmatrixSuggestBtn.addEventListener('click', () => {
    openTerminal();
    appendLine('cmatrix');
    startCurlAnimation(12000);
  });

  // keyboard quick open: press any key when closed to open
  document.addEventListener('keydown', (e) => {
    if (closedMessage && !closedMessage.hidden && (e.key && e.key.length === 1 || e.key === 'Enter')) {
      openTerminal();
    }
  });

  // ensure topline updates when prompt changes
  const originalUpdatePrompt = updatePrompt;
  updatePrompt = function() { originalUpdatePrompt(); updateTopline(); };

  // Update badge every minute
  setInterval(setBadgeTime, 60_000);

  // show small dynamic message to corner (accessible subtlety)
  if (cornerNote) cornerNote.textContent = 'echo "Olá, recrutador!"';
});