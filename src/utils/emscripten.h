#include <emscripten.h>
#include <string>

EM_JS(char *, emscripten_await_line, (), {
    const message = Asyncify.handleAsync(async () => {
        const queue = Module["queue"];
        return await queue.get();
    });
    const numberOfBytes = lengthBytesUTF8(message) + 1;
    const cString = _malloc(numberOfBytes);
    stringToUTF8(message, cString, numberOfBytes);
    return cString;
});

bool emscripten_read_line(std::string& result) {
    char *string = emscripten_await_line();
    result = string;
    std::free((void*)string);
    return result != "";
}
