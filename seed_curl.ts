import mongoose from "mongoose";
import Tool from "./src/models/Tool";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27018/arsenal";

const curlTool = {
    name: "cURL (Client URL)",
    category: "Discovery",
    developer: "Daniel Stenberg",
    tier: "Beginner",
    bestFor: "Web Testing & Session Analysis",
    overview: `
        <p><strong>cURL</strong> (Client URL) is an open-source command-line tool and library designed for transferring data with URLs using various protocols, including HTTP, HTTPS, FTP, FTPS, and more.</p>
        <p>Originally released in 1997, it has become the standard utility for interacting with web endpoints, testing APIs, analyzing response headers, and troubleshooting connections. In offensive security, cURL is used extensively for web application footprinting, security header verification, and active session testing.</p>
    `,
    core_modules: [
        {
            name: "URL_ANALYSIS",
            icon: "Globe",
            title: "URL Parsing & Mapping",
            description: "Extracts, categorizes, and filters hyperlinks and URL parameters from web pages and scripts to map the target application.",
            telemetry: [
                { key: "Extraction Mode", value: "Regex & CLI" },
                { key: "Targeting", value: "HTML & JS Content" }
            ]
        },
        {
            name: "SESSION_ANALYSIS",
            icon: "Shield",
            title: "Session Storage & Lifecycle",
            description: "Analyzes cookie behavior, captures authenticated session tokens, and tests cookie attributes such as HttpOnly, Secure, and SameSite.",
            telemetry: [
                { key: "Session Capturing", value: "Cookie Jar (-c)" },
                { key: "Session Replay", value: "Cookie Header (-b)" }
            ]
        },
        {
            name: "FINGERPRINTING",
            icon: "Terminal",
            title: "Web Fingerprinting & Headers",
            description: "Inspects HTTP headers, metadata, robots.txt, and sitemaps to map infrastructure and identify information leaks.",
            telemetry: [
                { key: "Inspection Mode", value: "HEAD Requests (-I)" },
                { key: "WAF Interrogation", value: "Signature Heuristics" }
            ]
        }
    ],
    installation_sequence: [
        {
            tabName: "Debian/Ubuntu",
            steps: [
                { id: "01", name: "UPDATE INDEX", desc: "Update package list to ensure retrieving latest builds.", cmd: "sudo apt update" },
                { id: "02", name: "INSTALL CURL", desc: "Deploy cURL binary via apt package manager.", cmd: "sudo apt install curl -y" },
                { id: "03", name: "VERIFY", desc: "Verify installation and version information.", cmd: "curl --version" }
            ]
        },
        {
            tabName: "Windows",
            steps: [
                { id: "01", name: "DEPLOY BINARY", desc: "Install cURL package directly via Winget package manager.", cmd: "winget install curl.curl" },
                { id: "02", name: "VERIFY", desc: "Confirm executable path and output version details.", cmd: "curl --version" }
            ]
        },
        {
            tabName: "macOS",
            steps: [
                { id: "01", name: "INSTALL BREW", desc: "Use Homebrew package manager to install cURL utility.", cmd: "brew install curl" },
                { id: "02", name: "VERIFY", desc: "Confirm version details of active binary.", cmd: "curl --version" }
            ]
        }
    ],
    scenarios: [
        {
                "name": "URL Harvesting & Categorization",
                "objective": "Harvest all hyperlinks from the target homepage and categorize them to map the attack surface.",
                "objectiveList": [
                        "Extract all unique href links from the homepage",
                        "Sort and de-duplicate discovered URLs",
                        "Group URLs into product, category, API, and auth subsets"
                ],
                "script": "# 1. Extract all unique links from target homepage\ncurl -s https://example.com | grep -o 'href=\"[^\"]*\"' | sed 's/href=\"//g' | sed 's/\"//g' | sort | uniq > urls.txt\n\n# 2. Categorize links into functional groups\ngrep \"/product/\" urls.txt > product_urls.txt\ngrep \"/category/\" urls.txt > category_urls.txt\ngrep \"/api/\" urls.txt > api_urls.txt\ngrep \"login\\\\|signin\\\\|auth\" urls.txt > auth_urls.txt",
                "logsImage": "/images/curl/image22.png",
                "keyTakeaways": [
                        {
                                "title": "LAYOUT_MAPPING",
                                "content": "Automated URL collection provides a structural map of accessible entry points."
                        },
                        {
                                "title": "FUNCTION_SEGREGATION",
                                "content": "Segregating authentication and API endpoints helps focus deeper scanning efforts."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "API_TARGETING",
                                "risk": "MEDIUM",
                                "desc": "Scan discovered API routes for authorization gaps and exposed resources."
                        }
                ]
        },
        {
                "name": "API & Parameter Discovery",
                "objective": "Identify hidden API endpoints and parameters by parsing client-side JavaScript assets.",
                "objectiveList": [
                        "Extract URL query parameters referenced in JavaScript files",
                        "Identify internal and external script references from the HTML",
                        "Download and query loaded scripts for API path patterns"
                ],
                "script": "# 1. Extract parameters from script sources\ncurl -s https://example.com/main.js | grep -o \"url.*?[^'\\\"]*\" | grep -o \"?[^'\\\"]*\" > parameters.txt\n\n# 2. Discover hidden API routes in loaded scripts\ncurl -s https://www.w3schools.com | grep -o '<script[^>]*src=\"[^\"]*\"' | grep -o 'src=\"[^\"]*\"' | cut -d'\"' -f2 | while read script; do\n  if [[ ! $script =~ ^http ]]; then\n    if [[ $script =~ ^// ]]; then script=\"https:$script\"; else script=\"https://www.w3schools.com$script\"; fi\n  fi\n  curl -s \"$script\" | grep -oE '/api/[^\"]+' | sort -u\ndone",
                "logsImage": "/images/curl/image23.png",
                "keyTakeaways": [
                        {
                                "title": "CLIENT_LOGIC",
                                "content": "Interrogating JS files exposes endpoints not indexed in normal HTML navigation."
                        },
                        {
                                "title": "API_EXPOSURE",
                                "content": "Undocumented API paths often lack robust access controls, leading to high exposure."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "IDOR_FUZZING",
                                "risk": "HIGH",
                                "desc": "Fuzz URL parameters found in JS to find insecure direct object references."
                        }
                ]
        },
        {
                "name": "Initial Cookie & Storage Inspection",
                "objective": "Examine cookies set on first visit to inspect session tracking mechanism and flags.",
                "objectiveList": [
                        "View Set-Cookie HTTP response headers on initial page fetch",
                        "Save initial cookies using curl cookie-jar output format",
                        "Analyze cookie attributes (domain, path, expiration, flags) in saved file"
                ],
                "script": "# 1. Inspect cookies returned during target visit\ncurl -s -v https://example.com 2>&1 | grep -i \"set-cookie\"\n\n# 2. Save cookies to local file and view\ncurl -I -c cookies.txt https://example.com\ncat cookies.txt",
                "logsImage": "/images/curl/image19.png",
                "keyTakeaways": [
                        {
                                "title": "COOKIE_PROPERTIES",
                                "content": "Standardized cookie formats include security rules like secure flag, domain scope, and path restriction."
                        },
                        {
                                "title": "PRE_AUTH_STATE",
                                "content": "Analyzing pre-authentication cookies reveals tracking frameworks and session initializers."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "SESSION_HIJACKING",
                                "risk": "HIGH",
                                "desc": "Exfiltrate cookies without secure/HttpOnly attributes via scripts or HTTP attacks."
                        }
                ]
        },
        {
                "name": "Session Extraction & Replay",
                "objective": "Extract authentication cookies and simulate access to protected areas via session replay.",
                "objectiveList": [
                        "Extract raw session identifier values from cookie jars using awk",
                        "Authenticate via form submit and store active session cookie",
                        "Use captured session identifier in a subsequent request to access a protected area"
                ],
                "script": "# 1. Extract session identifier from cookie jar\ngrep -i \"sessionid\\|phpsessid\\|jsessionid\" cookies.txt | awk '{print $NF}'\n\n# 2. Post credentials and capture authenticated session\ncurl -s -c auth_cookies.txt -X POST https://example.com/login \\\n     -d \"username=test&password=test123\" \\\n     -H \"Content-Type: application/x-www-form-urlencoded\"\n\n# 3. Extract and access protected resource using captured cookie\nSESSION_ID=$(grep -i \"sessionid\" auth_cookies.txt | awk '{print $NF}')\ncurl -s -b \"SESSIONID=$SESSION_ID\" https://example.com/protected-area",
                "logsImage": "/images/curl/image20.png",
                "keyTakeaways": [
                        {
                                "title": "COOKIE_IMPORTANCE",
                                "content": "Active session tokens contain absolute user authorization state."
                        },
                        {
                                "title": "REPLAY_CAPABILITY",
                                "content": "Without IP/User-Agent binding, session cookies can be replayed from any device."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "ACCOUNT_TAKEOVER",
                                "risk": "CRITICAL",
                                "desc": "Replay valid session cookies intercepted from target users to gain complete account access."
                        }
                ]
        },
        {
                "name": "Metadata & Server Fingerprinting",
                "objective": "Analyze HTTP response headers, meta tags, and comments to map target server technology.",
                "objectiveList": [
                        "Retrieve and filter server information and custom technology headers",
                        "Scan response headers for security-related header configurations",
                        "Extract HTML metadata and comments to locate sensitive data leaks",
                        "Download robots.txt and sitemap.xml to find private paths"
                ],
                "script": "# 1. Retrieve server stack information headers\ncurl -s -I https://example.com | grep -E 'Server|X-|Content-|Date'\n\n# 2. Verify security protection headers\ncurl -s -I https://example.com | grep -E 'X-XSS-Protection|X-Frame-Options|Content-Security-Policy|Strict-Transport-Security'\n\n# 3. Parse meta tags and comments\ncurl -s https://example.com | grep -o '<meta[^>]*>'\ncurl -s https://example.com | grep -o '<!--.*?-->'\n\n# 4. Fetch indexing definitions\ncurl -s https://example.com/robots.txt\ncurl -s https://example.com/sitemap.xml",
                "logsImage": "/images/curl/image1.png",
                "keyTakeaways": [
                        {
                                "title": "STACK_LEAK",
                                "content": "Server and X-Powered-By headers often leak precise OS and language versions."
                        },
                        {
                                "title": "MISSING_CONTROLS",
                                "content": "Absence of HSTS or CSP flags facilitates clickjacking and content-injection attacks."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "VULNERABILITY_MAPPING",
                                "risk": "MEDIUM",
                                "desc": "Map version numbers in Server headers to exploit DBs for public CVEs."
                        }
                ]
        },
        {
                "name": "Server Technology & WAF Mapping",
                "objective": "Enumerate web server frameworks, identify active WAFs, and check proxy parameters.",
                "objectiveList": [
                        "Probe server with malicious payload to check WAF block signatures",
                        "Detect cookie-based technology stacks and framework signatures",
                        "Query supported HTTP methods using OPTIONS request",
                        "Scan for Via and X-Forwarded headers indicating proxy layers"
                ],
                "script": "# 1. Send XSS probe to check for WAF interception\ncurl -s -I -X GET \"https://example.com/?test=<script>alert(1)</script>\" | grep -i 'server\\|x-powered-by\\|waf'\n\n# 2. Test HTTP options method allowances\ncurl -s -X OPTIONS https://example.com -i | grep -i allow\n\n# 3. Locate proxy transit headers\ncurl -s -I https://example.com | grep -i 'via\\|x-forwarded'",
                "logsImage": "/images/curl/image29.png",
                "keyTakeaways": [
                        {
                                "title": "WAF_DISCOVERY",
                                "content": "WAF blocks usually trigger distinct 403 Forbidden status codes or custom headers."
                        },
                        {
                                "title": "ROUTING_INFO",
                                "content": "Via/X-Forwarded headers leak internal proxy paths and network structure."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "WAF_BYPASS",
                                "risk": "HIGH",
                                "desc": "Optimize request syntax, headers, or characters to slide payloads past WAF filters."
                        }
                ]
        },
        {
                "name": "Session Vulnerability & Fixation Testing",
                "objective": "Audit session fixation vulnerabilities, session timeouts, and concurrent login policies.",
                "objectiveList": [
                        "Capture pre-login session ID and attempt post-login validation",
                        "Verify session termination post timeout duration",
                        "Audit secure, HttpOnly, and SameSite attributes on cookies",
                        "Test access controls during session puzzling and concurrent logins"
                ],
                "script": "# 1. Capture unauth session and check regeneration after login (Session Fixation)\ncurl -s -c unauth_cookies.txt http://testphp.vulnweb.com\nUNAUTH_SESSION=$(awk '/sessionid/ {print $NF}' unauth_cookies.txt | tail -n 1)\ncurl -s -b unauth_cookies.txt -c post_login_cookies.txt -X POST http://testphp.vulnweb.com/login.php \\\n     -d \"test%2Ftest\" -H \"Content-Type: application/x-www-form-urlencoded\"\nNEW_SESSION=$(awk '/sessionid/ {print $NF}' post_login_cookies.txt | tail -n 1)\nif [ \"$UNAUTH_SESSION\" = \"$NEW_SESSION\" ]; then echo \"VULNERABLE\"; else echo \"SECURE\"; fi\n\n# 2. Verify Session Timeout expiry\ncurl -s -c auth_cookies.txt -X POST https://example.com/login -d \"username=test&password=test123\"\nSESSION_ID=$(grep -i \"sessionid\" auth_cookies.txt | awk '{print $NF}')\ncurl -s -b \"SESSIONID=$SESSION_ID\" https://example.com/profile -o /dev/null -w \"Initial: %{http_code}\\n\"\nsleep 10 # Simulate waiting for session timeout\ncurl -s -b \"SESSIONID=$SESSION_ID\" https://example.com/profile -o /dev/null -w \"Post-timeout: %{http_code}\\n\"\n\n# 3. Verify security flags and SameSite attribute\ncurl -s -I https://example.com | grep -i \"set-cookie\" | grep -i \"secure\\|httponly\\|samesite\"",
                "logsImage": "/images/curl/image5.png",
                "keyTakeaways": [
                        {
                                "title": "FIXATION_EXPOSURE",
                                "content": "Failure to rotate session ID on authentication allows hijacking via pre-set cookies."
                        },
                        {
                                "title": "TIMEOUT_NECESSITY",
                                "content": "Extended session life increases window of opportunity for attackers to reuse cookies."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "SESSION_FIXATION",
                                "risk": "HIGH",
                                "desc": "Embed pre-auth session ID in link, trick victim into logging in, and take over session."
                        }
                ]
        },
        {
                "name": "Parameter Manipulation & Business Logic",
                "objective": "Audit parameters, hidden inputs, and redirect endpoints for trust boundary issues.",
                "objectiveList": [
                        "Tamper price and metadata parameters submitted via POST",
                        "Locate hidden fields within pages to test manual injection",
                        "Verify redirect destinations on HTTP requests"
                ],
                "script": "# 1. Test POST parameter manipulation (Price Tampering)\ncurl -s -X POST https://example.com/checkout -d \"item_id=101&price=1.00&quantity=1\"\n\n# 2. Search for hidden fields in forms\ncurl -s https://example.com/form | grep -i \"type=\\\"hidden\\\"\"\n\n# 3. Test HTTP to HTTPS redirection\ncurl -s -I http://example.com | grep -i \"Location\"",
                "logsImage": "/images/curl/image39.png",
                "keyTakeaways": [
                        {
                                "title": "INPUT_VALIDATION",
                                "content": "Client-side validation of variables like price can be easily bypassed by custom curl POST requests."
                        },
                        {
                                "title": "SSL_FORCE",
                                "content": "All HTTP endpoints must redirect immediately to secure SSL channels to prevent sniffer exposure."
                        }
                ],
                "attackPaths": [
                        {
                                "title": "PRICE_BYPASS",
                                "risk": "HIGH",
                                "desc": "Tamper with product price variables during checkout POST request to purchase items below cost."
                        }
                ]
        }
],
    troubleshooting: [
        { problem: "SSL Certificate verification failed", cause: "Target site uses self-signed, invalid, or expired SSL certificate.", resolution: "Use the -k or --insecure flag to bypass TLS validation.", command: "curl -k https://target-url.local" },
        { problem: "Connection Timeout", cause: "Network latency or firewall silently dropping traffic.", resolution: "Configure connection and operation timeouts.", command: "curl --connect-timeout 10 --max-time 30 https://example.com" },
        { problem: "Silent failure / missing output", cause: "curl is running in silent mode or stderr is not captured correctly.", resolution: "Enable verbose output to view full request and response handshake headers.", command: "curl -v https://example.com" }
    ],
    references_list: [
        { name: "Official Website & Manual", type: "Docs", url: "https://curl.se/docs/", updatedAt: "2026.06.16" },
        { name: "cURL GitHub Source Code", type: "GitHub", url: "https://github.com/curl/curl", updatedAt: "2026.06.16" },
        { name: "OWASP Web Testing Guide", type: "Docs", url: "https://owasp.org/www-project-web-security-testing-guide/", updatedAt: "2026.06.16" }
    ]
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB at 27018...");

        await Tool.deleteMany({ name: "cURL (Client URL)" });
        await Tool.create(curlTool);

        console.log("cURL Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("cURL Seeding failed:", error);
        process.exit(1);
    }
}

seed();
