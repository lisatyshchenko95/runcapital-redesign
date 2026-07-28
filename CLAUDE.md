# Run Capital Redesign

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

## Never delete RCP-TEMP comments

Blocks wrapped in `<!-- RCP-TEMP-HIDE ... RCP-TEMP-HIDE END -->` are team members
hidden **temporarily**, expected to return. `RCP-TEMP-MOVE` comments record where
someone originally sat before being shifted to fill a gap.

These are deliberate state, not dead code or leftover debris. Do not remove them when
cleaning up, simplifying, or reformatting — they are the only record of the original
team ordering, and deleting them means rebuilding the grid by hand.

`grep -rn "RCP-TEMP" .` lists every hidden person and relocation. See HANDOVER.md
section 5 for how to restore someone.

## Git workflow

`main` auto-deploys to the live site. Always `git pull` on `main` before starting,
work on a branch, and open a PR so there is a Vercel preview to check before it goes
public. Never commit directly to `main`.
