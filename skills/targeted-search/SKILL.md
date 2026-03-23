---
name: targeted-search
description: Memory-efficient search patterns for large codebases. Use grep/ripgrep instead of Glob/ListDir to avoid memory issues, especially in .cache/ directories with 1,400+ files.
---

# Targeted Search

## Critical Constraints

**NEVER use on large directories (especially `.cache/`):**
- Glob tool with broad patterns (e.g., `**/*.ts`)
- ListDir on directories with hundreds of files
- Recursive file listing without filters

**ALWAYS use memory-efficient strategies:**

### grep/ripgrep for Text Search

```bash
# Find text in specific file types
grep -r "pattern" --include="*.ts" path/to/search/

# Case-insensitive with line numbers and context
grep -rin -C 2 "pattern" --include="*.ts" ./

# List matching files only
grep -rl "pattern" --include="*.ts" ./
```

### find for File Discovery

```bash
# Find files by name pattern
find . -name "*.spec.ts" -type f

# Exclude directories
find . -name "*.ts" -not -path "*/node_modules/*" -type f
```

## Project-Specific Rules

- `.cache/` directories contain 1,400+ files — NEVER use Glob/ListDir here
- Always include component name in search paths for targeted lookup
- Use `grep` to query YAML/JSON config files instead of parsing manually

## Error Handling

**Too many results**: Add file type filters, more precise regex, limit with `head` or `-m`, narrow to subdirectories.

**No results**: Check for typos, try case-insensitive (`-i`), broaden file type filters, verify path exists.
