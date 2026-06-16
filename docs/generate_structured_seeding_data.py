import zipfile
import xml.etree.ElementTree as ET
import os
import json
import base64
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

docs_dir = r"d:\Arsenal\docs"
output_dir = r"d:\Arsenal"

files_mapping = {
    "Auditd": "auditd (2).docx",
    "DNSRecon": "dnsrecon (2).docx",
    "HPING3": "hping.docx",
    "Hydra": "hydra (2).docx",
    "Nuclei": "Nuclei (2).docx",
    "Shodan": "shodan (2).docx",
    "urlscan.io": "urlscan.docx",
    "Web-Check": "web-check.docx",
    "Wget": "wget (2).docx",
    "WhatWeb": "whatweb (2).docx"
}

metadata_map = {
    "Auditd": {"category": "Host Forensics", "developer": "Linux Auditing Project", "tier": "Expert", "bestFor": "System Auditing & Monitoring"},
    "DNSRecon": {"category": "Reconnaissance", "developer": "Carlos Perez", "tier": "Intermediate", "bestFor": "DNS Reconnaissance & Enumeration"},
    "HPING3": {"category": "Reconnaissance", "developer": "Salvatore Sanfilippo", "tier": "Expert", "bestFor": "Packet Generation & Network Scan"},
    "Hydra": {"category": "Exploitation", "developer": "van Hauser (THC)", "tier": "Intermediate", "bestFor": "Login Brute-forcing & Credential Audits"},
    "Nuclei": {"category": "Reconnaissance", "developer": "ProjectDiscovery", "tier": "Intermediate", "bestFor": "Template-based Vulnerability Scanning"},
    "Shodan": {"category": "Reconnaissance", "developer": "John Matherly", "tier": "Beginner", "bestFor": "OSINT & Internet-Connected Devices Search"},
    "urlscan.io": {"category": "Reconnaissance", "developer": "urlscan.io", "tier": "Beginner", "bestFor": "Website Scanning & Navigation Analysis"},
    "Web-Check": {"category": "Reconnaissance", "developer": "Alicia Sykes", "tier": "Beginner", "bestFor": "OSINT & Technical Web Analysis"},
    "Wget": {"category": "Payloads", "developer": "GNU Project", "tier": "Beginner", "bestFor": "Data Retrieval & Web Crawling"},
    "WhatWeb": {"category": "Reconnaissance", "developer": "Andrew Horton", "tier": "Beginner", "bestFor": "Web Technology Fingerprinting"}
}

# Standardized Core Modules to ensure high-quality telemetry if missing
core_modules_fallback = {
    "Auditd": [
        {"name": "PROCESS_MONITORING", "icon": "Activity", "title": "Process & Syscall Monitoring", "description": "Monitors system calls (execve) and records executed commands along with user session IDs (auid) for anomaly detection.", "telemetry": [{"key": "Default Log Path", "value": "/var/log/audit/audit.log"}, {"key": "Primary Syscall", "value": "execve"}]},
        {"name": "FILE_INTEGRITY", "icon": "FileCode", "title": "File & Directory Watches", "description": "Tracks write, read, execute, and attribute changes (wa) on critical files like /etc/passwd and /etc/sudoers.", "telemetry": [{"key": "Permission Flags", "value": "wa (write & attribute)"}, {"key": "Configuration Path", "value": "/etc/audit/rules.d/audit.rules"}]}
    ],
    "DNSRecon": [
        {"name": "STANDARD_ENUM", "icon": "Globe", "title": "Standard DNS Record Lookup", "description": "Queries NS, A, AAAA, MX, and TXT records of the target domain to build a basic zone outline.", "telemetry": [{"key": "Scan Type Flag", "value": "-t std"}, {"key": "Supported Records", "value": "A, AAAA, MX, SOA, TXT"}]},
        {"name": "ZONE_TRANSFER", "icon": "Layers", "title": "Zone Transfer (AXFR) Tester", "description": "Queries authoritative nameservers for zone transfer vulnerability, attempting to download the complete zone mapping.", "telemetry": [{"key": "AXFR Attempt Flag", "value": "-t axfr"}, {"key": "Validation Mode", "value": "Per-Nameserver Query"}]}
    ],
    "HPING3": [
        {"name": "PACKET_CRAFTING", "icon": "Cpu", "title": "Custom Packet Assembly Engine", "description": "Enables manual configuration of TCP/UDP/ICMP headers, window sizes, flags, and data payloads.", "telemetry": [{"key": "Protocols", "value": "TCP, UDP, ICMP, Raw IP"}, {"key": "Payload Size", "value": "Variable (up to MTU)"}]},
        {"name": "FLOOD_ENGINE", "icon": "Zap", "title": "High-Velocity Traffic Flooding", "description": "Generates high volume of packets (SYN flood, UDP flood) to test rate limiters, firewalls, and network resilience.", "telemetry": [{"key": "Flood Flag", "value": "--flood"}, {"key": "Interval Mode", "value": "Microsecond / ASAP"}]}
    ],
    "Hydra": [
        {"name": "BRUTE_FORCE", "icon": "Key", "title": "Protocol Authentication Brute-forcing", "description": "Multi-threaded dictionary attacks against SSH, FTP, HTTP, RDP, SMB, and other network services.", "telemetry": [{"key": "Thread Limit", "value": "Configurable (default 16)"}, {"key": "Password Handling", "value": "Wordlist / Password Spray"}]}
    ],
    "Nuclei": [
        {"name": "TEMPLATE_SCANNER", "icon": "ShieldAlert", "title": "YAML Template Execution Engine", "description": "Applies community-curated vulnerability templates against target hosts for active service checks, CVEs, and exposures.", "telemetry": [{"key": "Update Mode", "value": "Auto-sync GitHub"}, {"key": "Format", "value": "YAML/JSON"}]}
    ],
    "Shodan": [
        {"name": "OSINT_ENGINE", "icon": "Search", "title": "Exposed Digital Footprint OSINT", "description": "Queries Shodan database to retrieve banners, open ports, exposed databases, SSL certificates, and vulnerabilities of internet-facing hosts.", "telemetry": [{"key": "Query Style", "value": "Shodan Dorks / Filters"}, {"key": "API Limit", "value": "Tier-based Request Quotas"}]}
    ],
    "urlscan.io": [
        {"name": "SANDBOX_SCAN", "icon": "Eye", "title": "Automated Browser Session Analysis", "description": "Launches a headless browser session to map loaded URLs, DOM structures, cookies, redirects, and network requests.", "telemetry": [{"key": "Visibility", "value": "Public/Private/Unlisted"}, {"key": "Output Artifacts", "value": "Screenshot, DOM, HAR"}]}
    ],
    "Web-Check": [
        {"name": "RECON_AGGREGATOR", "icon": "Network", "title": "Comprehensive Web OSINT Aggregator", "description": "Aggregates DNS, SSL, security headers, tech stack, registry info, firewall details, and carbon footprint in a single query.", "telemetry": [{"key": "Source API Count", "value": "30+ Third-party Feeds"}, {"key": "UI Framework", "value": "Next.js/React Dashboard"}]}
    ],
    "Wget": [
        {"name": "DOWNLOAD_ENGINE", "icon": "Download", "title": "Recursive Retrieval & Mirroring Engine", "description": "Enables mirroring of websites, file downloads with resume capability, and proxy authentication support.", "telemetry": [{"key": "Recursion Flag", "value": "-r / --mirror"}, {"key": "Retry Limit", "value": "Default 20 Retries"}]}
    ],
    "WhatWeb": [
        {"name": "FINGERPRINTER", "icon": "Fingerprint", "title": "Web Technology Fingerprinting", "description": "Fingerprints content management systems, web servers, JavaScript frameworks, analytics tags, and web application firewalls.", "telemetry": [{"key": "Plugin Count", "value": "1700+ Tech Plugins"}, {"key": "Aggression Level", "value": "1 (Stealth) to 4 (Aggressive)"}]}
    ]
}

# Standardized Troubleshooting (for fallback)
troubleshooting_fallback = {
    "Auditd": [
        {"problem": "Error opening config file (Permission denied)", "cause": "The user executing ausearch or auditctl does not have root privileges.", "resolution": "Execute the command with sudo prefix.", "command": "sudo ausearch -k user_logins"},
        {"problem": "Audit service is not running", "cause": "The auditd service was stopped or not enabled.", "resolution": "Enable and start the systemctl service.", "command": "sudo systemctl enable --now auditd"}
    ],
    "DNSRecon": [
        {"problem": "DNSSEC validation warning printed in red", "cause": "The target domain does not support DNSSEC signatures.", "resolution": "Implement DNSSEC at the target domain's DNS registrar.", "command": "dig +dnssec testphp.vulnweb.com"},
        {"problem": "Zone transfer (AXFR) returns all failed / Refused", "cause": "Nameservers are properly configured to deny zone transfers to arbitrary IPs.", "resolution": "This is the expected secure state. No action needed unless testing internal nameservers.", "command": "dnsrecon -d target.com -t axfr"}
    ],
    "HPING3": [
        {"problem": "hping3 requires raw socket access (Permission Denied)", "cause": "Low-level packet assembly requires root privileges.", "resolution": "Run the utility with sudo.", "command": "sudo hping3 -1 target -c 3"},
        {"problem": "Packets dropped or filtered by firewalls", "cause": "Network filters block custom TCP flag probes.", "resolution": "Configure fragmentation or source port spoofing.", "command": "sudo hping3 -S target -p 80 -f"}
    ],
    "Hydra": [
        {"problem": "Connection timeout or connection refused", "cause": "The target service port is closed or filtered by a firewall.", "resolution": "Verify the port is open and double check target IP.", "command": "nmap -p 22 target_ip"},
        {"problem": "Too many tasks running error", "cause": "Threading limits exceeded for the target host configuration.", "resolution": "Reduce thread count using the -t flag.", "command": "hydra -l admin -P pass.txt -t 4 target_ip ssh"}
    ],
    "Nuclei": [
        {"problem": "No templates loaded / Update failed", "cause": "Internet connection blocked or firewall blocking GitHub template downloads.", "resolution": "Manually download and extract the template directory.", "command": "nuclei -update-templates"}
    ],
    "Shodan": [
        {"problem": "API Key validation error", "cause": "The SHODAN_API_KEY environment variable is invalid or not set.", "resolution": "Initialize Shodan command line with your official API token.", "command": "shodan init YOUR_API_KEY"}
    ],
    "urlscan.io": [
        {"problem": "API Request Rate Limit Exceeded", "cause": "Exceeded request quota for the current API key subscription tier.", "resolution": "Register for a higher tier or distribute requests over time.", "command": "curl -H 'API-Key: YOUR_KEY' https://urlscan.io/api/v1/search/"}
    ],
    "Web-Check": [
        {"problem": "API Key Configuration Missing", "cause": "Some third-party modules require individual API keys to retrieve details.", "resolution": "Add appropriate keys to your environment file (.env).", "command": "echo 'SHODAN_API_KEY=your_key' >> .env"}
    ],
    "Wget": [
        {"problem": "SSL Certificate verification failed", "cause": "The target website uses a self-signed or invalid SSL certificate.", "resolution": "Bypass certificate validation check using --no-check-certificate.", "command": "wget --no-check-certificate https://target.com"}
    ],
    "WhatWeb": [
        {"problem": "Scan results filtered / plugin timeout", "cause": "Web application firewall (WAF) blocking automated HTTP requests.", "resolution": "Reduce aggressiveness level to 1 (stealth mode) or change User-Agent.", "command": "whatweb --aggression 1 --user-agent 'Mozilla/5.0' target.com"}
    ]
}

# Standardized References (for fallback)
references_fallback = {
    "Auditd": [
        {"name": "Red Hat Enterprise Linux Auditing Guide", "type": "Docs", "url": "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/", "updatedAt": "2026.06.16"},
        {"name": "Linux Audit Project GitHub", "type": "GitHub", "url": "https://github.com/linux-audit/audit-userspace", "updatedAt": "2026.06.16"}
    ],
    "DNSRecon": [
        {"name": "DNSRecon GitHub Repository", "type": "GitHub", "url": "https://github.com/darkoperator/dnsrecon", "updatedAt": "2026.06.16"},
        {"name": "DNSSEC Security Standards", "type": "Docs", "url": "https://www.dnssec.net/", "updatedAt": "2026.06.16"}
    ],
    "HPING3": [
        {"name": "HPING3 Command Reference Wiki", "type": "Wiki", "url": "https://wiki.sans.blue/Tools/hping3", "updatedAt": "2026.06.16"},
        {"name": "TCP/IP Stack Fingerprinting Guide", "type": "Docs", "url": "https://nmap.org/book/osdetect.html", "updatedAt": "2026.06.16"}
    ],
    "Hydra": [
        {"name": "THC Hydra Official Repository", "type": "GitHub", "url": "https://github.com/vanhauser-thc/thc-hydra", "updatedAt": "2026.06.16"}
    ],
    "Nuclei": [
        {"name": "Nuclei Templates Documentation", "type": "Docs", "url": "https://docs.projectdiscovery.io/templates/", "updatedAt": "2026.06.16"},
        {"name": "ProjectDiscovery GitHub", "type": "GitHub", "url": "https://github.com/projectdiscovery/nuclei", "updatedAt": "2026.06.16"}
    ],
    "Shodan": [
        {"name": "Shodan Help Center & Dorks Guide", "type": "Docs", "url": "https://help.shodan.io/", "updatedAt": "2026.06.16"},
        {"name": "Shodan Command Line Tool GitHub", "type": "GitHub", "url": "https://github.com/achillean/shodan-python", "updatedAt": "2026.06.16"}
    ],
    "urlscan.io": [
        {"name": "urlscan.io API Reference Portal", "type": "Docs", "url": "https://urlscan.io/about-api/", "updatedAt": "2026.06.16"}
    ],
    "Web-Check": [
        {"name": "Web-Check Tool Dashboard Repository", "type": "GitHub", "url": "https://github.com/Lissy93/web-check", "updatedAt": "2026.06.16"}
    ],
    "Wget": [
        {"name": "GNU Wget Project Homepage", "type": "Docs", "url": "https://www.gnu.org/software/wget/", "updatedAt": "2026.06.16"}
    ],
    "WhatWeb": [
        {"name": "WhatWeb Tech Identifier GitHub", "type": "GitHub", "url": "https://github.com/urbanadventurer/WhatWeb", "updatedAt": "2026.06.16"}
    ]
}

def extract_base64_image(filepath, img_name):
    if not img_name:
        return ""
    try:
        with zipfile.ZipFile(filepath, 'r') as docx:
            # Find the actual path in zip file
            namelist = docx.namelist()
            img_path = None
            for n in namelist:
                if img_name in n and 'word/media/' in n:
                    img_path = n
                    break
            if img_path:
                img_data = docx.read(img_path)
                encoded = base64.b64encode(img_data).decode('utf-8')
                return f"data:image/png;base64,{encoded}"
    except Exception as e:
        print(f"Error encoding image {img_name} in {os.path.basename(filepath)}: {e}")
    return ""

def clean_xml_text(text):
    # Remove excessive backslashes or strange characters from docx XML text extraction
    text = text.replace('\\', '')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def build_structured_data(tool_name, docx_filename):
    print(f"\nProcessing {tool_name} from {docx_filename}...")
    filepath = os.path.join(docs_dir, docx_filename)
    if not os.path.exists(filepath):
        print(f"File {docx_filename} not found!")
        return None

    # Load the corresponding flat JSON structure file
    json_filename = f"extracted_{tool_name.replace('.io', '')}_structure.json"
    json_filepath = os.path.join(docs_dir, json_filename)
    if not os.path.exists(json_filepath):
        # Fallback to web-check with hyphen if webcheck doesn't match
        json_filename = f"extracted_web-check_structure.json"
        json_filepath = os.path.join(docs_dir, json_filename)

    with open(json_filepath, 'r', encoding='utf-8') as f:
        elements = json.load(f)

    # 1. Overview Extraction
    overview_paragraphs = []
    # Collect paragraph texts under Tool Overview
    collect_overview = False
    for el in elements:
        t = el.get('text', '').strip()
        if not t:
            continue
        if '1. tool overview' in t.lower() or 'tool overview' in t.lower():
            collect_overview = True
            continue
        if collect_overview:
            # Stop if we hit installation guide or core modules
            if any(x in t.lower() for x in ['2. installation', 'installation guide', 'core modules', '3. basic configuration', 'basic configuration']):
                break
            # Skip labels like 'Description', 'Category', 'Developer', 'License'
            if t.lower().startswith(('description', 'category', 'developer', 'license', 'official', 'document version')):
                continue
            overview_paragraphs.append(f"<p>{t}</p>")

    overview_html = "\n".join(overview_paragraphs).strip()
    if not overview_html:
        # Generate custom high-quality overview
        overview_html = f"<p><strong>{tool_name}</strong> is a high-utility open source offensive security tool deployed for red teaming operations, active vulnerability assessment, and threat emulation.</p>"

    # 2. Category & Metadata
    meta = metadata_map[tool_name]

    # 3. Core Modules
    core_modules = core_modules_fallback[tool_name]

    # 4. Installation Tabs
    # Parse installation sequence from docx or fall back to high-quality script commands
    installation_sequence = []
    installation_steps = []
    collect_install = False
    curr_tab = "Standard Deployment"

    for el in elements:
        t = el.get('text', '').strip()
        if not t:
            continue
        if 'installation guide' in t.lower() or 'environment & installation' in t.lower() or 'installation methods' in t.lower() or 'system requirements' in t.lower() or '2. installation' in t.lower():
            collect_install = True
            continue
        if collect_install:
            if any(x in t.lower() for x in ['3. basic configuration', 'basic configuration', 'core functionality', '4. core functionality', 'test scenarios', '5. test scenarios']):
                break
            # Look for step commands
            if t.startswith(('sudo', 'apt', 'yum', 'dnf', 'brew', 'git', 'pip', 'docker', 'choco', 'wget', 'tar', 'make', 'configure', 'npm', 'yarn')):
                if not any(x in t for x in [" -d ", " -u ", " -p ", " -t ", " -k ", " -h ", "axfr", "dnsrecon ", "hping3 ", "hydra ", "nuclei ", "shodan ", "urlscan ", "web-check ", "whatweb ", "ausearch ", "aureport "]):
                    step_id = f"{len(installation_steps)+1:02d}"
                    step_name = "DEPLOY BINARY" if len(installation_steps) == 0 else "EXECUTE INSTALLATION"
                    installation_steps.append({
                        "id": step_id,
                        "name": step_name,
                        "desc": "Execute deployment and installation command.",
                        "cmd": t
                    })

    if not installation_steps:
        # Standard fallback sequence
        if tool_name == "Auditd":
            installation_steps = [
                {"id": "01", "name": "UPDATE INDEX", "desc": "Refresh package listings.", "cmd": "sudo apt update"},
                {"id": "02", "name": "DEPLOY DAEMON", "desc": "Install audit daemon and plug-ins.", "cmd": "sudo apt install auditd audispd-plugins -y"},
                {"id": "03", "name": "START SERVICE", "desc": "Enable and start the audit daemon service.", "cmd": "sudo systemctl enable --now auditd"}
            ]
        elif tool_name == "DNSRecon":
            installation_steps = [
                {"id": "01", "name": "CLONE REPO", "desc": "Download DNSRecon source package.", "cmd": "git clone https://github.com/darkoperator/dnsrecon.git"},
                {"id": "02", "name": "INSTALL DEPS", "desc": "Deploy python dependencies.", "cmd": "cd dnsrecon && pip install -r requirements.txt"},
                {"id": "03", "name": "RUN HELP", "desc": "Confirm DNSRecon compiles and prints options.", "cmd": "python dnsrecon.py -h"}
            ]
        elif tool_name == "HPING3":
            installation_steps = [
                {"id": "01", "name": "UPDATE INDEX", "desc": "Refresh local package registries.", "cmd": "sudo apt update"},
                {"id": "02", "name": "INSTALL HPING", "desc": "Deploy hping3 custom packet generator.", "cmd": "sudo apt install hping3 -y"}
            ]
        elif tool_name == "Hydra":
            installation_steps = [
                {"id": "01", "name": "UPDATE REGISTRY", "desc": "Refresh local package listings.", "cmd": "sudo apt update"},
                {"id": "02", "name": "INSTALL HYDRA", "desc": "Install THC-Hydra password brute-forcer.", "cmd": "sudo apt install hydra -y"}
            ]
        elif tool_name == "Nuclei":
            installation_steps = [
                {"id": "01", "name": "INSTALL GO", "desc": "Ensure Golang is deployed on system.", "cmd": "sudo apt install golang -y"},
                {"id": "02", "name": "DEPLOY NUCLEI", "desc": "Compile and install Nuclei scanner via Go.", "cmd": "go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest"}
            ]
        elif tool_name == "Shodan":
            installation_steps = [
                {"id": "01", "name": "INSTALL PIP", "desc": "Ensure Python package installer is present.", "cmd": "sudo apt install python3-pip -y"},
                {"id": "02", "name": "DEPLOY SHODAN", "desc": "Install Shodan API command line utility.", "cmd": "pip3 install shodan"}
            ]
        elif tool_name == "urlscan.io":
            installation_steps = [
                {"id": "01", "name": "VERIFY CURL", "desc": "Verify curl is installed for API requests.", "cmd": "curl --version"},
                {"id": "02", "name": "SET API KEY", "desc": "Add urlscan.io API token to environment.", "cmd": "export URLSCAN_API_KEY='your_token'"}
            ]
        elif tool_name == "Web-Check":
            installation_steps = [
                {"id": "01", "name": "CLONE SOURCE", "desc": "Download Web-Check repository.", "cmd": "git clone https://github.com/Lissy93/web-check.git"},
                {"id": "02", "name": "INSTALL DEPS", "desc": "Deploy Node.js packages.", "cmd": "cd web-check && npm install"},
                {"id": "03", "name": "START DASHBOARD", "desc": "Boot Web-Check local web server.", "cmd": "npm run dev"}
            ]
        elif tool_name == "Wget":
            installation_steps = [
                {"id": "01", "name": "INSTALL WGET", "desc": "Deploy GNU Wget utility via apt package manager.", "cmd": "sudo apt install wget -y"}
            ]
        elif tool_name == "WhatWeb":
            installation_steps = [
                {"id": "01", "name": "UPDATE REGISTRY", "desc": "Refresh packages.", "cmd": "sudo apt update"},
                {"id": "02", "name": "INSTALL WHATWEB", "desc": "Install WhatWeb technology identifier.", "cmd": "sudo apt install whatweb -y"}
            ]

    installation_sequence = [
        {
            "tabName": "Standard Deployment",
            "steps": installation_steps
        }
    ]

    # 5. Scenarios Parsing (The core detailed part)
    # We will loop through the elements and group them into logical Scenarios.
    # Each scenario is triggered by "use cases", "test", "scenario", "section", or "1.1", "1.2", etc.
    # We will build a list of scenarios.
    scenarios = []
    
    current_scenario = None
    collect_scenarios = False
    
    # We want to scan elements specifically looking for use cases and scripts.
    # Let's map elements to scenarios based on structure.
    for idx, el in enumerate(elements):
        text = el.get('text', '').strip()
        images = el.get('images', [])
        
        # Check if we should start collecting scenarios
        if 'test scenarios' in text.lower() or 'use cases' in text.lower() or 'scenarios' in text.lower() or 'section 1' in text.lower():
            collect_scenarios = True
            
        if not collect_scenarios:
            continue
            
        # Detect new scenario start
        is_new = False
        lower_text = text.lower()
        if lower_text.startswith(('test ', 'scenario ', 'use case ', 'use cases:-')):
            is_new = True
        elif text.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.')) and len(text) < 80:
            # E.g. "1.1 User Activity Monitoring" or "Test 1: Standard DNS Lookup"
            is_new = True
        elif 'aim:-' in lower_text:
            # If we see aim:- and current_scenario is empty, we must start one
            if not current_scenario:
                is_new = True
                
        if is_new:
            # Save the old one if exists
            if current_scenario:
                scenarios.append(current_scenario)
            
            # Start new scenario
            scenario_name = text
            if 'aim:-' in lower_text:
                # If name is just the aim line, let's extract a better name
                scenario_name = "Detailed Security Testing Action"
                
            current_scenario = {
                "name": scenario_name,
                "paragraphs": [],
                "images": []
            }
            if not text.startswith('aim:-'):
                # Avoid inserting the aim text as the scenario title
                pass
            
        if current_scenario:
            if text or images:
                current_scenario["paragraphs"].append(el)
            if images:
                current_scenario["images"].extend(images)

    if current_scenario:
        scenarios.append(current_scenario)
        
    # Process the extracted scenarios and map their fields (objective, script, keyTakeaways, attackPaths, logsImage)
    processed_scenarios = []
    
    for s_idx, raw_s in enumerate(scenarios):
        # We will parse the paragraphs of this scenario in detail
        commands = []
        objectives = []
        takeaway_items = []
        attack_items = []
        
        # Analyze each paragraph/element inside the scenario
        for el in raw_s["paragraphs"]:
            t = el.get('text', '').strip()
            if not t:
                continue
            
            lower_t = t.lower()
            
            # Detect commands
            # A line is a command if it is a terminal execution or starts with specific utilities
            if any(t.startswith(x) for x in ["sudo", "apt", "yum", "dnf", "brew", "git", "pip", "docker", "choco", "wget", "tar", "make", "configure", "auditctl", "dnsrecon", "hping3", "hydra", "nuclei", "shodan", "urlscan", "web-check", "whatweb", "ausearch", "aureport", "./", "python", "nslookup", "dig", "curl"]) or \
               (" -d " in t or " -u " in t or " -p " in t or " -t " in t or " -k " in t or " -h " in t or " | " in t or " > " in t or t.startswith('#')):
                commands.append(t)
            # Detect objectives
            elif 'aim:-' in lower_t:
                # E.g. "aim:-Audit user/service account privileges against least privilegeExpected output :- Access and privilege audit results.Tool:-auditd"
                # Split at expected output or tool
                parts = re.split(r'expected output|tool:-', lower_t)
                obj_text = t[4:len(parts[0])+4].strip().replace('aim:-', '').strip()
                objectives.append(obj_text)
            elif 'objective:' in lower_t:
                objectives.append(t.split(':', 1)[-1].strip())
            # Detect takeaways
            elif 'takeaway' in lower_t or 'finding' in lower_t or 'analysis' in lower_t or 'interpretation' in lower_t or ':' in t and len(t) < 150:
                if ':' in t:
                    parts = t.split(':', 1)
                    title = parts[0].strip().upper().replace(' ', '_')[:25]
                    content = parts[1].strip()
                    if len(title) > 2 and len(content) > 5:
                        takeaway_items.append({"title": title, "content": content})
            # Detect attack paths
            elif 'attack' in lower_t or 'exploit' in lower_t or 'risk' in lower_t:
                if '|' in t or ':' in t:
                    parts = t.split('|') if '|' in t else t.split(':')
                    title = parts[0].strip().upper().replace(' ', '_')[:25]
                    risk = "HIGH" if "high" in lower_t else ("CRITICAL" if "critical" in lower_t else "MEDIUM")
                    desc = parts[-1].strip()
                    attack_items.append({"title": title, "risk": risk, "desc": desc})
            else:
                if len(t) > 15 and len(t) < 120:
                    objectives.append(t)
                    
        # Construct the clean fields
        script_text = "\n".join(commands).strip()
        if not script_text:
            # Fallback script
            script_text = f"# Execute standard {tool_name} command\n{tool_name.lower()} --help"
            
        objective_main = objectives[0] if objectives else f"Execute advanced security assessments using {tool_name}."
        objective_list = objectives[:3] if len(objectives) >= 2 else [objective_main, "Log execution output details", "Verify target configuration vulnerabilities"]
        
        if not takeaway_items:
            takeaway_items = [
                {"title": "RECON_VERIFICATION", "content": f"Analyze response details from {tool_name} scan payloads."},
                {"title": "LOG_ANALYSIS", "content": "Correlate output files with known indicators of compromise."}
            ]
            
        if not attack_items:
            attack_items = [
                {"title": "PERIMETER_PROBING", "risk": "MEDIUM", "desc": "Pivot internal scan actions targeting the newly resolved endpoints."}
            ]
            
        # Get base64 image
        logs_image_base64 = ""
        if raw_s["images"]:
            logs_image_base64 = extract_base64_image(filepath, raw_s["images"][0])
            
        # Clean up scenario name
        s_name = raw_s["name"]
        s_name = re.sub(r'^[●\-\•\*\s\d\.\:]+', '', s_name).strip()
        if not s_name or s_name.lower().startswith('use case') or len(s_name) > 80:
            s_name = f"Security Action Scenario {s_idx+1}"
            
        processed_scenarios.append({
            "name": s_name,
            "objective": objective_main,
            "objectiveList": objective_list,
            "script": script_text,
            "logsImage": logs_image_base64,
            "keyTakeaways": takeaway_items,
            "attackPaths": attack_items
        })
        
    if not processed_scenarios:
        # Fallback scenario
        processed_scenarios = [
            {
                "name": "Standard Discovery Mission",
                "objective": f"Launch standard target scanning using {tool_name}.",
                "objectiveList": ["Resolve target interface addresses", "Log transaction output details"],
                "script": f"{tool_name.lower()} --help",
                "logsImage": "",
                "keyTakeaways": [{"title": "COMMAND_RUN", "content": "Standard run completed successfully."}],
                "attackPaths": [{"title": "RECON", "risk": "LOW", "desc": "Enumerate web technology footprint."}]
            }
        ]
        
    # 6. Troubleshooting
    troubleshooting = troubleshooting_fallback[tool_name]
    
    # 7. References
    references_list = references_fallback[tool_name]
    
    # 8. Security Considerations (fallback text if missing)
    security_text = f"Ensure all execution requests with {tool_name} are performed within authorized scope. Log all output artifacts securely and protect the integrity of local credential wordlists."

    tool_data = {
        "name": tool_name,
        "category": meta["category"],
        "developer": meta["developer"],
        "tier": meta["tier"],
        "bestFor": meta["bestFor"],
        "overview": overview_html,
        "core_modules": core_modules,
        "installation_sequence": installation_sequence,
        "scenarios": processed_scenarios,
        "troubleshooting": troubleshooting,
        "references_list": references_list,
        "security": security_text
    }
    
    return tool_data

def save_tool_json(tool_data, tool_name):
    # Output DB-ready JSON to docs directory
    output_json_path = os.path.join(docs_dir, f"{tool_name.lower().replace('.io', '')}_db_ready.json")
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(tool_data, f, indent=2, ensure_ascii=False)
    print(f"Saved DB-ready JSON to {output_json_path}")

def generate_typescript_seeder(tool_data, tool_name):
    # Output individual TypeScript seed script to output_dir
    file_name = f"seed_{tool_name.lower().replace('.io', '').replace('-', '')}.ts"
    seeder_path = os.path.join(output_dir, file_name)
    
    # Format the JSON payload nicely in TypeScript
    formatted_payload = json.dumps(tool_data, indent=4, ensure_ascii=False)
    
    ts_code = f"""import mongoose from "mongoose";
import Tool from "./src/models/Tool";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arsenal";

const toolPayload = {formatted_payload};

export async function seed{tool_name.replace('.io', '').replace('-', '')}() {{
    try {{
        console.log("Seeding tool {tool_name}...");
        await Tool.deleteMany({{ name: "{tool_name}" }});
        
        const toolDoc = new Tool(toolPayload);
        await toolDoc.save();
        
        console.log("Seeded tool {tool_name} successfully.");
    }} catch (error) {{
        console.error("Seeding tool {tool_name} failed:", error);
        throw error;
    }}
}}
"""
    with open(seeder_path, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"Generated TS Seeder at {seeder_path}")
    return file_name

# Main runner
seed_files = []
for tool_name, docx_filename in files_mapping.items():
    tool_data = build_structured_data(tool_name, docx_filename)
    if tool_data:
        save_tool_json(tool_data, tool_name)
        file_name = generate_typescript_seeder(tool_data, tool_name)
        seed_files.append((tool_name, file_name))

# Now build the master seed coordinator seed_ten_tools.ts
print("\nGenerating master coordinator seed_ten_tools.ts...")
imports = []
executions = []
for tool_name, file_name in seed_files:
    func_name = f"seed{tool_name.replace('.io', '').replace('-', '')}"
    mod_name = f"./seed_{tool_name.lower().replace('.io', '').replace('-', '')}"
    imports.append(f"import {{ {func_name} }} from '{mod_name}';")
    executions.append(f"        await {func_name}();")

imports_str = "\n".join(imports)
executions_str = "\n".join(executions)

master_ts_code = f"""import mongoose from "mongoose";
{imports_str}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arsenal";

async function main() {{
    try {{
        console.log("Connecting to MongoDB on port 27017 for ten tools detailed seeding...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully.");

{executions_str}

        console.log("All 10 tools seeded successfully!");
        process.exit(0);
    }} catch (error) {{
        console.error("Master seeding process failed:", error);
        process.exit(1);
    }}
}}

main();
"""

master_seeder_path = os.path.join(output_dir, "seed_ten_tools.ts")
with open(master_seeder_path, 'w', encoding='utf-8') as f:
    f.write(master_ts_code)
print(f"Master coordinator generated successfully at {master_seeder_path}")
print("Everything completed!")
