#include <nan.h>
#include <inttypes.h>
using namespace v8;

NAN_METHOD(SetStream)
{
    Nan::HandleScope scope;

    Isolate *isolate = info.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    // v8::Local<v8::Object> mediaStream = info[0]->ToObject(context);
    Local<Object> mediaStream = Local<Object>::Cast(info[0]);
    MaybeLocal<Value> get_audio_tracks = mediaStream->Get(context, info[1]);

    // Maybe needs to be v8::Object or array?
    // if (!get_audio_tracks.IsEmpty())
    // {
    //     v8::Local<v8::Value> audio_tracks = get_audio_tracks.ToLocalChecked()();
    // }
    Local<Value> get_audio_tracks_local = get_audio_tracks.ToLocalChecked();
    Local<Function> getAudioTracksFn = Local<Function>::Cast(get_audio_tracks_local);
    Local<Value> audioTracks = getAudioTracksFn->Call(context, mediaStream, 0, {}).ToLocalChecked();

    Local<Array> audioTrackArray = Local<Array>::Cast(audioTracks);

    int length = audioTrackArray->Length();
    // int length = audioTracks->Length();

    // if (audioTracks->IsArray())
    // {
    //     length = audioTracks->Get(v8::String::New("length"))->ToObject()->Uint32Value();
    // }
    printf("length: %d \n", length);
    for (int i = 0; i < length; i++)
    {
        v8::Local<v8::Value> element = audioTrackArray->Get(context, i).ToLocalChecked();
        printf("%" PRIu32 "\n",element->ToObject(context).ToLocalChecked()->ToUint32(context).ToLocalChecked());
        printf("\n next # \n");
    }

    info.GetReturnValue().Set(audioTrackArray);
}

// void InitAll(Handle<Object> exports) {
//   exports->Set(NanSymbol("setStream"),
//     FunctionTemplate::New(SetStream)->GetFunction());
// }
NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New("setStream").ToLocalChecked(),
             Nan::GetFunction(Nan::New<FunctionTemplate>(SetStream)).ToLocalChecked());
}

NODE_MODULE(mediastream_addon, Init)
