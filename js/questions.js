// Linux Skill Assessment - 25 Questions
// Topics: Filesystem, vi/vim, Users/Groups, Permissions, ACL, sudo,
// systemd, SSH, Networking, Package management, Compression, Shell scripting,
// cron, Disk partitioning, Mounting, LVM, Swap, NFS, SELinux, Firewall,
// Apache/Nginx, Boot process, GRUB, Containers, Troubleshooting

const QUESTIONS = [
    {
        id: 1,
        question: "Which directory in the Linux Filesystem Hierarchy Standard (FHS) contains configuration files for the system?",
        options: [
            "/var",
            "/etc",
            "/tmp",
            "/usr"
        ],
        correctAnswer: 1,
        explanation: "/etc contains system-wide configuration files. /var holds variable data like logs, /tmp holds temporary files, and /usr contains user programs and data."
    },
    {
        id: 2,
        question: "In vi/vim editor, which mode is used to execute commands like saving a file or quitting the editor?",
        options: [
            "Insert mode",
            "Visual mode",
            "Command mode (ex mode)",
            "Replace mode"
        ],
        correctAnswer: 2,
        explanation: "Command mode (also called ex mode) is accessed by pressing ':' in normal mode and is used for commands like :wq, :q!, :s, etc."
    },
    {
        id: 3,
        question: "Which command creates a new user account with a home directory and adds the user to the 'developers' supplementary group?",
        options: [
            "useradd -m -G developers username",
            "adduser -g developers username",
            "useradd -d /home/username username",
            "usermod -aG developers username"
        ],
        correctAnswer: 0,
        explanation: "useradd -m creates a home directory, and -G specifies supplementary groups. usermod modifies existing users, not creates new ones."
    },
    {
        id: 4,
        question: "A file has permissions set to 750 (rwxr-x---). What does the '5' in the middle position represent?",
        options: [
            "Read and write for group",
            "Read and execute for group",
            "Read only for group",
            "Execute only for group"
        ],
        correctAnswer: 1,
        explanation: "In 750: 7 = rwx (owner), 5 = r-x (group: read + execute), 0 = --- (others: no permissions)."
    },
    {
        id: 5,
        question: "Which command is used to set POSIX Access Control Lists (ACLs) on a file?",
        options: [
            "chacl",
            "setfacl",
            "chmod +acl",
            "aclset"
        ],
        correctAnswer: 1,
        explanation: "setfacl sets ACLs on files and directories. getfacl retrieves them. chmod only handles traditional Unix permissions."
    },
    {
        id: 6,
        question: "Which file contains the configuration for sudo access and is edited using the visudo command?",
        options: [
            "/etc/sudo.conf",
            "/etc/suoders",
            "/etc/sudoers",
            "/etc/sudo/config"
        ],
        correctAnswer: 2,
        explanation: "/etc/sudoers is the sudo configuration file. visudo edits it safely with syntax checking to prevent locking yourself out."
    },
    {
        id: 7,
        question: "Which systemctl command displays the status of a service including recent log entries?",
        options: [
            "systemctl status service-name",
            "systemctl show service-name",
            "systemctl info service-name",
            "systemctl list-units service-name"
        ],
        correctAnswer: 0,
        explanation: "systemctl status shows the service state, PID, memory usage, and the last 10 log entries from the journal."
    },
    {
        id: 8,
        question: "Which SSH command generates a 4096-bit RSA key pair for key-based authentication?",
        options: [
            "ssh-keygen -t rsa -b 4096",
            "ssh-keygen -m RSA -s 4096",
            "ssh-genkey -rsa -size 4096",
            "openssl genrsa -out key 4096"
        ],
        correctAnswer: 0,
        explanation: "ssh-keygen -t rsa -b 4096 generates an RSA key pair with 4096-bit strength. The private key is id_rsa, public key is id_rsa.pub."
    },
    {
        id: 9,
        question: "Which command displays all active network connections and listening sockets on a modern Linux system?",
        options: [
            "netstat -tuln",
            "ip addr show",
            "ss -tuln",
            "route -n"
        ],
        correctAnswer: 2,
        explanation: "ss (socket statistics) is the modern replacement for netstat. ss -tuln shows TCP/UDP listening sockets numerically."
    },
    {
        id: 10,
        question: "On a RHEL 8/9 system, which command lists all installed packages with their versions?",
        options: [
            "rpm -qa",
            "yum list installed",
            "dnf list installed",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "All three commands work: rpm -qa queries the RPM database directly, while yum/dnf list installed queries the repository metadata. All list installed packages."
    },
    {
        id: 11,
        question: "Which tar command creates a gzip-compressed archive named 'backup.tar.gz' from the /etc directory?",
        options: [
            "tar -czf backup.tar.gz /etc",
            "tar -czip backup.tar.gz /etc",
            "tar -cvf - /etc | gzip > backup.tar.gz",
            "Both A and C are correct"
        ],
        correctAnswer: 3,
        explanation: "tar -czf creates a gzipped archive directly. The pipeline 'tar -cvf - | gzip' achieves the same result and both are valid approaches."
    },
    {
        id: 12,
        question: "In a Bash script, what does the special variable '$?' represent after running a command?",
        options: [
            "The PID of the last command",
            "The exit status of the last command",
            "The number of arguments passed",
            "The username of the current user"
        ],
        correctAnswer: 1,
        explanation: "$? holds the exit status of the most recently executed foreground command. 0 means success, non-zero indicates an error."
    },
    {
        id: 13,
        question: "A cron entry '0 3 * * 0 /usr/local/bin/backup.sh' will execute the backup script at which time?",
        options: [
            "Daily at 3:00 AM",
            "Every Sunday at 3:00 AM",
            "Every Monday at 3:00 AM",
            "Every 3rd day of the month at midnight"
        ],
        correctAnswer: 1,
        explanation: "Cron format: minute hour day month weekday. '0 3 * * 0' = 0th minute, 3rd hour, any day, any month, Sunday (0=Sunday)."
    },
    {
        id: 14,
        question: "Which command displays the partition table of the first SATA disk (/dev/sda) in a human-readable format?",
        options: [
            "fdisk -l /dev/sda",
            "parted /dev/sda print",
            "lsblk /dev/sda",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "fdisk -l shows partition tables, parted print shows partition layout, and lsblk shows block device tree. All display partition information."
    },
    {
        id: 15,
        question: "What is the purpose of the /etc/fstab file?",
        options: [
            "It lists all filesystem types supported by the kernel",
            "It defines filesystems to be mounted at boot time",
            "It stores the mount history of removable devices",
            "It configures the automounter for network filesystems"
        ],
        correctAnswer: 1,
        explanation: "/etc/fstab (filesystem table) defines what filesystems should be mounted, where, with which options, and in what order at boot."
    },
    {
        id: 16,
        question: "Which sequence of LVM commands correctly creates a logical volume?",
        options: [
            "pvcreate -> vgcreate -> lvcreate",
            "vgcreate -> pvcreate -> lvcreate",
            "lvcreate -> pvcreate -> vgcreate",
            "pvcreate -> lvcreate -> vgcreate"
        ],
        correctAnswer: 0,
        explanation: "LVM workflow: pvcreate (physical volumes) -> vgcreate (volume group from PVs) -> lvcreate (logical volume from VG)."
    },
    {
        id: 17,
        question: "Which command activates a swap partition or file for immediate use?",
        options: [
            "swapon",
            "mkswap",
            "swap enable",
            "fallocate swap"
        ],
        correctAnswer: 0,
        explanation: "swapon activates swap devices/files. mkswap sets up swap area headers (one-time setup). The swap file/partition must first be prepared with mkswap."
    },
    {
        id: 18,
        question: "What is the purpose of the /etc/exports file?",
        options: [
            "It defines which directories are shared via NFS and to which clients",
            "It exports environment variables for all users",
            "It lists network interfaces available for NFS traffic",
            "It configures firewall rules for NFS ports"
        ],
        correctAnswer: 0,
        explanation: "/etc/exports defines NFS shares: which directories are exported, to which client hosts, and with what options (ro, rw, no_root_squash, etc.)."
    },
    {
        id: 19,
        question: "In SELinux, which mode logs access violations but does not enforce them?",
        options: [
            "Enforcing",
            "Permissive",
            "Disabled",
            "Logging"
        ],
        correctAnswer: 1,
        explanation: "SELinux Permissive mode logs denials but does not block actions. Enforcing blocks and logs. Disabled has no SELinux policy active."
    },
    {
        id: 20,
        question: "Which firewall-cmd option makes a rule permanent across reboots?",
        options: [
            "--permanent",
            "--save",
            "--reboot",
            "--persist"
        ],
        correctAnswer: 0,
        explanation: "--permanent makes the rule survive reboots. Without --permanent, rules are only in the runtime configuration and lost on reload/reboot."
    },
    {
        id: 21,
        question: "On RHEL/CentOS systems, what is the default port for the Apache (httpd) web server?",
        options: [
            "443",
            "8080",
            "80",
            "8443"
        ],
        correctAnswer: 2,
        explanation: "HTTP default port is 80. HTTPS is 443. 8080 is a common alternative HTTP port. Apache's main config is /etc/httpd/conf/httpd.conf."
    },
    {
        id: 22,
        question: "Which component is responsible for loading the kernel into memory during the Linux boot process?",
        options: [
            "systemd",
            "GRUB (Grand Unified Bootloader)",
            "initramfs",
            "BIOS/UEFI firmware"
        ],
        correctAnswer: 1,
        explanation: "GRUB loads the Linux kernel and initramfs into memory. BIOS/UEFI initializes hardware and finds the boot device. systemd is PID 1 after boot."
    },
    {
        id: 23,
        question: "Where is the GRUB 2 configuration file typically located on a RHEL/CentOS system?",
        options: [
            "/boot/grub/grub.cfg",
            "/boot/grub2/grub.cfg",
            "/etc/default/grub",
            "/grub/grub.conf"
        ],
        correctAnswer: 1,
        explanation: "On RHEL/CentOS/Fedora, GRUB2 config is at /boot/grub2/grub.cfg. /etc/default/grub is the source file edited by admins, then grub2-mkconfig regenerates grub.cfg."
    },
    {
        id: 24,
        question: "Which container runtime is the default on RHEL 8/9 and provides a Docker-compatible CLI?",
        options: [
            "containerd",
            "podman",
            "cri-o",
            "docker-engine"
        ],
        correctAnswer: 1,
        explanation: "podman is the default container tool on RHEL 8/9. It's daemonless, rootless by default, and CLI-compatible with Docker. docker-engine is not default on RHEL."
    },
    {
        id: 25,
        question: "Which command displays kernel ring buffer messages, useful for diagnosing hardware and driver issues at boot?",
        options: [
            "journalctl -k",
            "dmesg",
            "tail /var/log/syslog",
            "Both A and B are correct"
        ],
        correctAnswer: 3,
        explanation: "dmesg reads the kernel ring buffer directly. journalctl -k shows kernel messages from the systemd journal. Both are valid for boot/hardware troubleshooting."
    }
];

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle options within each question (keeping track of correct answer)
function shuffleQuestionOptions(question, shuffleAnswers = false) {
    if (!shuffleAnswers) {
        return { ...question, shuffledAnswerIndex: question.correctAnswer };
    }
    
    const optionsWithIndex = question.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    const shuffledOptions = shuffleArray(optionsWithIndex);
    
    const newCorrectIndex = shuffledOptions.findIndex(opt => opt.originalIndex === question.correctAnswer);
    
    return {
        ...question,
        options: shuffledOptions.map(opt => opt.text),
        correctAnswer: newCorrectIndex,
        shuffledAnswerIndex: newCorrectIndex
    };
}

// Shuffle an entire set of questions
function shuffleQuestions(questions, shuffleAnswers = false) {
    const shuffled = shuffleArray(questions);
    return shuffled.map(q => shuffleQuestionOptions(q, shuffleAnswers));
}

// Get the alphabet marker for an option index
function getOptionMarker(index) {
    const markers = ['A', 'B', 'C', 'D'];
    return markers[index] || '?';
}
