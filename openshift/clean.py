#!/usr/bin/env python3
"""Clean OpenShift YAML manifests: strip status, timestamps, managedFields, etc."""
import sys
import yaml
from pathlib import Path

OCS = Path('/c/Users/FASLA/linux-skill-assessment/openshift')

RAW_FILES = [
    'service_raw.yaml',
    'route_raw.yaml',
    'hpa_raw.yaml',
    'networkpolicy_raw.yaml',
    'serviceaccount_raw.yaml',
    'role_raw.yaml',
    'rolebinding_raw.yaml',
    'secret_raw.yaml',
]

def clean_metadata(metadata):
    """Remove system-generated fields from metadata."""
    if not metadata:
        return metadata
    for key in ['managedFields', 'uid', 'resourceVersion', 'creationTimestamp',
                'generation', 'selfLink', 'ownerReferences', 'finalizers',
                'deletionGracePeriodSeconds', 'deletionTimestamp']:
        metadata.pop(key, None)
    # Remove status-related annotations
    if 'annotations' in metadata:
        annos = metadata['annotations']
        for key in list(annos.keys()):
            if any(part in key.lower() for part in ['kubectl.kubernetes.io/last-applied', 'statefulset.kubernetes.io']):
                annos.pop(key, None)
    return metadata

def clean_doc(doc):
    """Recursively strip status and system-generated metadata."""
    if not isinstance(doc, dict):
        return doc
    
    # Strip status at the doc level (many resources have .status)
    doc.pop('status', None)
    
    # Clean root metadata
    if 'metadata' in doc and isinstance(doc['metadata'], dict):
        clean_metadata(doc['metadata'])
    
    # Clean spec.template.metadata (for Deployments, etc.)
    if 'spec' in doc and isinstance(doc['spec'], dict):
        spec = doc['spec']
        if 'template' in spec and isinstance(spec['template'], dict):
            tmpl = spec['template']
            if 'metadata' in tmpl and isinstance(tmpl['metadata'], dict):
                clean_metadata(tmpl['metadata'])
            # Also clean status on pod template status (rare but possible)
            tmpl.pop('status', None)
        
        # HPA: strip status
        if 'status' in spec:
            spec.pop('status', None)
    
    # For LIST objects (service, route, etc. returned as arrays)
    if doc.get('kind') == 'List' or isinstance(doc.get('items'), list):
        for item in doc.get('items', []):
            if isinstance(item, dict):
                item.pop('status', None)
                if 'metadata' in item and isinstance(item['metadata'], dict):
                    clean_metadata(item['metadata'])
                if 'spec' in item and isinstance(item['spec'], dict):
                    spec = item['spec']
                    if 'template' in spec and isinstance(spec['template'], dict):
                        tmpl = spec['template']
                        if 'metadata' in tmpl and isinstance(tmpl['metadata'], dict):
                            clean_metadata(tmpl['metadata'])
    
    return doc

TOPS = {
    'service.yaml': 'service_raw.yaml',
    'route.yaml': 'route_raw.yaml',
    'hpa.yaml': 'hpa_raw.yaml',
    'networkpolicy.yaml': 'networkpolicy_raw.yaml',
    'serviceaccount.yaml': 'serviceaccount_raw.yaml',
    'role.yaml': 'role_raw.yaml',
    'rolebinding.yaml': 'rolebinding_raw.yaml',
    'secret.yaml': 'secret_raw.yaml',
}

for out_name, raw_name in TOPS.items():
    raw_path = OCS / raw_name
    out_path = OCS / out_name
    if not raw_path.exists():
        print(f"❌ MISSING RAW: {raw_name}")
        continue
    
    raw_text = raw_path.read_text()
    # Parse multi-doc YAML (some oc get outputs are Lists)
    docs = list(yaml.safe_load_all(raw_text))
    cleaned_docs = []
    for doc in docs:
        cleaned = clean_doc(doc)
        cleaned_docs.append(cleaned)
    
    # Write back as YAML — always a single doc if original was a single List of one item
    out_text = yaml.dump_all(cleaned_docs, default_flow_style=False, sort_keys=False, width=100)
    out_path.write_text(out_text)
    print(f"✅ Wrote {out_name} ({len(cleaned_docs)} doc(s), {len(out_text)} bytes)")
    if len(cleaned_docs) != 1:
        print(f"   ⚠ {out_name} has {len(cleaned_docs)} docs — verify manually")
    
print("Done.")
