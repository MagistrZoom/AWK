#!/home/s191941/bin/gawk -f

END{
cmd="printf 'qdGlZFt5XaTk2UNnP+saFA==258EAFA5-E914-47DA-95CA-C5AB0DC85B11' | /usr/sfw/bin/openssl sha1 -binary | /usr/sfw/bin/openssl base64";

print cmd;
cmd|getline key;
print key;
}
