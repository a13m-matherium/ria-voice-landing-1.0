
{
  "targets": [
    { 
      "include_dirs" : [
	"<!(node -e \"require('nan')\")"
      ],
      "target_name": "mediastream_addon",
      "sources": [ "mediastream_addon.cc" ],
    }
  ]
}
