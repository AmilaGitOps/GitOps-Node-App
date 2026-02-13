# GitOps-Node-App
Javascript and deploy to k8s by using ArgoCd Gitops

Best Practices Used :

* Running the docker containers as a non root user. Which will prevent utilizing the host machine kernal by docker containers for permissions/risks issues.
* .dockerignore file used to prevent copying unwanted files inside the docker image and minimize the docker image size.
* Kubernetes deployment.yaml livenessProbe and readinessProbe for pods health checks etc.
* Kubernetes manifests (kustomize overlays) used.

  Can use Kubernetes HPA (Horizontal pod autoscaler) if want to autoscale in future needs.




