#!/bin/bash

env=${1-dev}
echo "Deploying to $env"

oc project 9b301c-tools

# Stop environment
getPods () {
  name=${1-}
  type=${2-dc}
  env=${3-'dev'}
  result=$(oc get $type -n 9b301c-$env $name -o "jsonpath={.status.availableReplicas}")
  echo $result
  return $result
}

scale () {
  name=${1-}
  replicas=${2-0}
  type=${3-dc}
  env=${4-'dev'}
  oc scale $type $name -n 9b301c-$env --replicas=$replicas
}

contentMigrationHistoricServiceName="contentmigration-historic-service"
if [ "$env" = "dev" ]; then
  contentMigrationHistoricServiceName="contentmigration-service-historic"
fi

podsApi=$(getPods api sts $env)
podsCharts=$(getPods charts-api dc $env)
podsEditor=$(getPods editor dc $env)
podsSubscriber=$(getPods subscriber dc $env)

podsCapture=$(getPods capture-service dc $env)
podsContentMigration=$(getPods contentmigration-service dc $env)
podsContentMigrationHistoric=$(getPods $contentMigrationHistoricServiceName dc $env)
podsFileMonitor=$(getPods filemonitor-service dc $env)
podsSyndication=$(getPods syndication-service dc $env)
podsImage=$(getPods image-service dc $env)

podsIndexing=$(getPods indexing-service dc $env)
podsContent=$(getPods content-service dc $env)
podsContentTNO=$(getPods content-tno-service dc $env)

podsFileCopy=$(getPods filecopy-service dc $env)
podsFolderCollection=$(getPods folder-collection-service dc $env)

podsClip=$(getPods clip-service dc $env)
podsFFmpeg=$(getPods ffmpeg-service dc $env)
podsNLP=$(getPods nlp-service dc $env)
podsTranscription=$(getPods transcription-service dc $env)

podsScheduler=$(getPods scheduler-service dc $env)
podsReporting=$(getPods reporting-service dc $env)
podsNotification=$(getPods notification-service dc $env)
podsEventHandler=$(getPods event-handler-service dc $env)

# Stop everyting
# scale api 0 sts
scale charts-api 0 dc $env
scale editor 0 dc $env
scale subscriber 0 dc $env

scale capture-service 0 dc $env
scale contentmigration-service 0 dc $env
scale contentmigration-service-historic 0 dc $env
scale filemonitor-service 0 dc $env
scale syndication-service 0 dc $env
scale image-service 0 dc $env

scale indexing-service 0 dc $env
scale content-service 0 dc $env
scale content-tno-service 0 dc $env

scale filecopy-service 0 dc $env
scale folder-collection-service 0 dc $env

scale clip-service 0 dc $env
scale ffmpeg-service 0 dc $env
scale nlp-service 0 dc $env
scale transcription-service 0 dc $env

scale scheduler-service 0 dc $env
scale reporting-service 0 dc $env
scale notification-service 0 dc $env
scale event-handler-service 0 dc $env

# APIs
oc tag api:latest api:$env
oc rollout restart sts/api -n 9b301c-$env

oc rollout status --watch --timeout=600s sts/api -n 9b301c-$env

oc tag charts-api:latest charts-api:$env

# Web Application
oc tag editor:latest editor:$env
oc tag subscriber:latest subscriber:$env

# Ingest Services
oc tag capture-service:latest capture-service:$env
oc tag contentmigration-service:latest contentmigration-service:$env
oc tag filemonitor-service:latest filemonitor-service:$env
oc tag syndication-service:latest syndication-service:$env
oc tag image-service:latest image-service:$env

# Store Services
oc tag indexing-service:latest indexing-service:$env
oc tag content-service:latest content-service:$env

# Utility Services
oc tag filecopy-service:latest filecopy-service:$env
oc tag folder-collection-service:latest folder-collection-service:$env

# Transform Services
oc tag clip-service:latest clip-service:$env
oc tag ffmpeg-service:latest ffmpeg-service:$env
oc tag nlp-service:latest nlp-service:$env
oc tag transcription-service:latest transcription-service:$env

# Output Services
oc tag scheduler-service:latest scheduler-service:$env
oc tag reporting-service:latest reporting-service:$env
oc tag notification-service:latest notification-service:$env
oc tag event-handler-service:latest event-handler-service:$env

# Start everying
scale api $podsApi sts $env
scale charts-api $podsCharts dc $env
scale editor $podsEditor dc $env
scale subscriber $podsSubscriber dc $env

scale capture-service $podsCapture dc $env
scale contentmigration-service $podsContentMigration dc $env
scale $contentMigrationHistoricServiceName $podsContentMigrationHistoric dc $env
scale filemonitor-service $podsFileMonitor dc $env
scale syndication-service $podsSyndication dc $env
scale image-service $podsImage dc $env

scale indexing-service $podsIndexing dc $env
scale content-service $podsContent dc $env
scale content-tno-service $podsContentTNO dc $env

scale filecopy-service $podsFileCopy dc $env
scale folder-collection-service $podsFolderCollection dc $env

scale clip-service $podsClip dc $env
scale ffmpeg-service $podsFFmpeg dc $env
scale nlp-service $podsNLP dc $env
scale transcription-service $podsTranscription dc $env

scale scheduler-service $podsScheduler dc $env
scale reporting-service $podsReporting dc $env
scale notification-service $podsNotification dc $env
scale event-handler-service $podsEventHandler dc $env
