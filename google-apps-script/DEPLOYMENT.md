# Deployment Checklist

1. Open the Google Apps Script project and paste `Code.gs`.
2. Set Script Properties:
   - `CMS_PASSWORD_HASH`
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `GITHUB_BRANCH`
3. Run `setCmsPassword('YourStrongCustomerPassword')` once and approve the requested permissions.
4. Deploy → New deployment → Web app.
5. Execute as: Me.
6. Who has access: Anyone.
7. Copy the `/exec` URL.
8. Put the URL into `cms-config.json` under `apiEndpoint`.
9. Redeploy the frontend CMS.
10. Open the CMS and verify the Customer Login screen appears.
11. Login with the customer password.
12. Edit content and use `Publish to GitHub`.
13. Confirm one new Git commit contains the content changes.

Security notes:

- Never put `GITHUB_TOKEN` in the React frontend or `cms-config.json`.
- Never store the customer password in GitHub.
- Use a strong customer password of at least 10 characters.
- Rotate the GitHub token if it is ever exposed.
