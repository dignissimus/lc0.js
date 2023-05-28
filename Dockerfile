FROM ubuntu:jammy
RUN apt-get update
RUN apt-get install llvm binaryen nodejs git libstdc++-11-dev clang ninja-build pkg-config python3-pip -y
RUN pip3 install meson
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR emsdk
RUN ./emsdk install latest && ./emsdk activate latest && echo 'source "/emsdk/emsdk_env.sh"' >> $HOME/.bashrc
COPY . /lc0.js
WORKDIR /lc0.js
RUN rm -r build;
RUN bash -c ". /emsdk/emsdk_env.sh && ./build.sh"
