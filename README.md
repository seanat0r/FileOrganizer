# FileOrganizer

A cross-platform, automated file management utility designed to organize your digital workspace effortlessly.

## About the Project

FileOrganizer is an intelligent automation tool that monitors your file system and automatically categorizes files based
on user-defined rules. Whether it's sorting downloads, organizing documents, or cleaning up messy directories,
FileOrganizer ensures your files are exactly where they belong.

## Tech Stack

### Backend (Java)

- **Language:** Java 26
- **Framework:** Javalin 6 (Lightweight Web Framework)
- **Build Tool:** Maven
- **Architecture:** Local `jlink`-generated runtime for standalone execution

### Frontend & Desktop

- **Framework:** React
- **Desktop Runtime:** Electron
- **Communication:** Local HTTP API (Javalin)

---

## Key Features

- **Intelligent Automation:** Customizable rules for file sorting and categorization.
- **Cross-Platform:** Native support for macOS and Windows.
- **Portability:** Lightweight and standalone, thanks to modular `jlink` runtimes.

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/seanat0r/FileOrganizer
cd FileOrganizer
```

### 2. Generate Java Runtime (JRE)

To ensure the app runs without a system-wide Java installation, we generate a custom, modular JRE:

1. Navigate to your JDK 26 `bin` directory.
2. Execute `jlink`:

```bash
jlink --add-modules java.base,java.desktop,java.net.http,java.sql,jdk.unsupported --output jre --strip-debug --no-man-pages --no-header-files --compress zip-6
```

3. Move the jre folder to the target directory:
    - **macOS:** `FileOrganizer-Desktop/backend/jre/`
    - **windows:** `FileOrganizer-Desktop/backend/jre/`
    - Rename the new folder there to `mac` or `windows`!

### 3. Build the Frontend:

```bash
cd frontend
npm install
npm run build
```

Move the contents of `dist/` to `/FileOrganizer-Desktop` and rename it to `frontend-dist`

### 4. Start the Application

Make sure in `/FileOrganizer-Desktop/backend/` is the `File_organazier-1.0.jar` file!

```bash
cd /FileOrganizer-Desktop
npm install
npm start
```

## Project Structure

```Plaintext
FileOrganizer/
├── backend/          # Java source code (Maven)
├── frontend/         # React source code
├── FileOrganizer-Desktop/
│   ├── backend/      # JAR & JRE-Runtimes
│   └── frontend-dist/ # Compiled frontend assets
└── LICENSE
```

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.
