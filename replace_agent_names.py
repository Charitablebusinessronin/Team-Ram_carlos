#!/usr/bin/env python3
"""
Batch replace agent names in documentation files.
Maps the harness agent names to the actual agent names from the fork.
"""

import os
import re
from pathlib import Path

# Agent name mappings (harness name -> actual fork name)
AGENT_MAPPINGS = {
    "BROOKS_ARCHITECT": "OpenAgent",
    "JOBS_INTENT_GATE": "OpenAgent",  # Intent gate is part of OpenAgent's orchestration
    "SCOUT_RECON": "ContextScout",
    "WOZ_BUILDER": "CoderAgent",
    "PIKE_INTERFACE_REVIEW": "OpenCoder",  # Interface review is part of OpenCoder's workflow
    "FOWLER_REFACTOR_GATE": "OpenCoder",  # Refactor gate is part of OpenCoder's workflow
    "BELLARD_DIAGNOSTICS_PERF": "OpenCoder",  # Perf diagnostics is part of OpenCoder's workflow
}

# Files to process
FILES_TO_PROCESS = [
    "BLUEPRINT.md",
    "SOLUTION-ARCHITECTURE.md",
    "DESIGN-ROUTING.md",
    "DESIGN-LOGGING.md",
    "REQUIREMENTS-MATRIX.md",
    "RISKS-AND-DECISIONS.md",
    "DATA-DICTIONARY.md",
    ".opencode/contracts/harness-v1.md",
]

def replace_agent_names(content):
    """Replace all agent names in content using the mappings."""
    for old_name, new_name in AGENT_MAPPINGS.items():
        # Replace in various contexts
        content = content.replace(old_name, new_name)
        # Replace lowercase versions
        content = content.replace(old_name.lower(), new_name.lower())
        # Replace with underscores
        content = content.replace(old_name.replace("_", "-"), new_name if "-" in new_name else new_name)
        content = content.replace(old_name.replace("_", "_"), new_name)
    
    return content

def process_file(filepath):
    """Process a single file."""
    print(f"Processing: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace agent names
        new_content = replace_agent_names(content)
        
        # Write back if changed
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  ✓ Updated: {filepath}")
            return True
        else:
            print(f"  - No changes: {filepath}")
            return False
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
        return False

def main():
    """Main function."""
    print("=== Agent Name Replacement Script ===\n")
    
    # Get the repository root
    repo_root = Path("/home/ronin704/Projects/opencode config")
    
    updated_count = 0
    for filename in FILES_TO_PROCESS:
        filepath = repo_root / filename
        if filepath.exists():
            if process_file(filepath):
                updated_count += 1
        else:
            print(f"File not found: {filepath}")
    
    print(f"\n=== Summary ===")
    print(f"Files processed: {len(FILES_TO_PROCESS)}")
    print(f"Files updated: {updated_count}")
    
    # Print the mapping for reference
    print(f"\n=== Agent Name Mappings ===")
    for old_name, new_name in AGENT_MAPPINGS.items():
        print(f"  {old_name} → {new_name}")

if __name__ == "__main__":
    main()