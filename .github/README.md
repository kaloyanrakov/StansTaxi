# GitHub Actions CI/CD Pipeline

This directory contains GitHub Actions workflows for automated CI/CD.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Triggers:** Push/PR to main, master, or develop branches

**Jobs:**
- **Backend Build**: Builds and tests the Spring Boot backend
- **Frontend Build**: Builds and tests the React frontend
- **Docker Build**: Creates Docker images (on push only)
- **Integration Tests**: Runs tests with MySQL service

**Artifacts:** Backend JAR and Frontend build files (retained for 5 days)

### 2. Docker Publish (`docker-publish.yml`)
**Triggers:** 
- On release creation
- Manual trigger via workflow_dispatch

**Jobs:**
- Builds and pushes Docker images to Docker Hub
- Tags images with version numbers and latest tag

### 3. PR Validation (`pr-validation.yml`)
**Triggers:** Pull request opened/updated

**Jobs:**
- Validates PR title format (semantic commits)
- Lints backend Java code
- Lints frontend JavaScript/React code
- Runs security scans with Trivy

## Required GitHub Secrets

To enable all features, add these secrets in **Settings → Secrets and variables → Actions**:

### Required for Frontend Build:
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key

### Container Registry Options (Choose ONE):

#### Option 1: Docker Hub
Uncomment Docker Hub login in workflow files and add:
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

#### Option 2: GitHub Container Registry (Recommended)
Uncomment GitHub Container Registry login in workflow files.
- No additional secrets needed! Uses `GITHUB_TOKEN` (automatically provided)
- Update image names to: `ghcr.io/${{ github.repository_owner }}/stanstaxi-backend`

#### Option 3: Google Artifact Registry
Uncomment Google Artifact Registry login in workflow files and add:
- `GCP_CREDENTIALS` - Service account JSON key with Artifact Registry Writer role
- Update image names to: `us-central1-docker.pkg.dev/PROJECT_ID/REPO_NAME/backend`

### Optional (for deployment):
- Add any deployment-specific secrets (AWS, Azure, etc.)

## Setup Instructions

1. **Enable GitHub Actions:**
   - Go to your repository → Actions tab
   - Enable workflows if prompted

2. **Choose and Configure Container Registry:**

   ### Option A: GitHub Container Registry (Easiest - Recommended)
   1. Enable GitHub Container Registry in your repo
   2. Uncomment the GitHub CR section in `docker-publish.yml` and `ci-cd.yml`
   3. Update image names in metadata actions:
      ```yaml
      images: ghcr.io/${{ github.repository_owner }}/stanstaxi-backend
      ```
   4. Make sure push: true in docker build steps

   ### Option B: Google Artifact Registry
   1. Create a service account in Google Cloud with Artifact Registry Writer role
   2. Download JSON key and add as `GCP_CREDENTIALS` secret
   3. Uncomment the Google AR section in workflow files
   4. Update image names to your GAR repository
   5. Update region if needed (default: us-central1)

   ### Option C: Docker Hub
   1. Create access token at https://hub.docker.com/settings/security
   2. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
   3. Uncomment Docker Hub section in workflow files

3. **Add Required Secrets:**
   ```
   Repository Settings → Secrets and variables → Actions → New repository secret
   ```
   
   Add at minimum:
   - `REACT_APP_GOOGLE_MAPS_API_KEY` - Your Google Maps API key
   - Registry-specific secrets (see Container Registry Options above)

4. **Update Image Names (if not using Docker Hub):**
   Edit `.github/workflows/docker-publish.yml` and update the `images:` field in metadata actions.

5. **Enable Image Pushing:**
   In `ci-cd.yml` and `docker-publish.yml`, change `push: false` to `push: true` when ready.

6. **Push code to trigger workflows:**
   ```bash
   git add .
   git commit -m "feat: add GitHub Actions CI/CD pipeline"
   git push origin main
   ```

## Workflow Status Badges

Add these to your main README.md:

```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml)
[![Docker Publish](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/docker-publish.yml)
```

## Customization

### To modify build steps:
- Edit the workflow YAML files in `.github/workflows/`

### To add deployment:
Create a new workflow file or add deployment steps to `ci-cd.yml`:

```yaml
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [docker-build]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to server
      # Add your deployment steps here
```

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
choco install act-cli

# Run workflows locally
act push
act pull_request
```

## Support

For issues or questions about the CI/CD pipeline, create an issue in the repository.
