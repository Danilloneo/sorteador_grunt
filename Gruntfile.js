module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //primeiro instalamos e configuramos o less e as pastas
        less: {//criamos duas sessões no less development desenvolvedor e producao onde nelas demos instrucoes
            //do desenvolvedor dissemos olha pega o main.less na pasta src e joga na dev styles main.css
            development: {
                //         Destino                     origem
                files: {'dev/styles/main.css' : 'src/styles/main.less'}		
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    //destino                         origem
                    'dist/styles/main.min.css' : 'src/styles/main.less' // quando a task verifica o less development que é esse ambiente
                    //tambem executa a conversao de src para dist no watch
                }
            }
        }, //instalamos o plugin watch para não ter que ficar toda hora dando npm run grunt nas alterações e nas compilações
        watch: {
            less: {//dizemos pegue no less os arquivos src/styles todos os arquivos e pastas dentro de styles todos arquivos.less
                files: ['src/styles/**/*.less'],
                tasks: ['less:development'] //e observe a tarefa less:development que criamos acima ou seja pegar origem, mandar destino
            },
            html: {//dissemos olha o html agora e pegue os arquivos src/index.html e observe a tarefa em repalce:dev
                //que nada mais é ele vai olhar o que a gente escreveu em src nessa tarefa e colar na pasta dev
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: {
            dev: { //aqui no replace criamos varias condições no ambiente de dev ou a pasta /dev que o nosso ambiente de dev é nada mais do que o espelho do src onde o desenvolvedor trabalha
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',//eu quero que ele encontre essa palavra e substitua pelo caminho abaixo
                            replacement: './styles/main.css' //apos fazer isso fomos na nossa index e colocamos o caminho @@endereco no href do stylesheet
                        },
                        {
                            match: 'ENDERECO_DO_JS',//eu quero que ele encontre essa palavra e substitua pelo caminho abaixo
                            replacement: '../src/scripts/main.js' //apos fazer isso fomos na nossa index e colocamos o caminho @@endereco no href do stylesheet
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], //vai pegar o que a gente escreve em index src e dar o replace na dev
                        dest: 'dev/'
                    }
                ]
            },
            dist: {// no ambiente dist onde vai ser consumido pelo servidor
                options: { //opcoes
                    patterns: [ //pegue os parentes
                        {
                            match: 'ENDERECO_DO_CSS', //com esse nome
                            replacement: './styles/main.min.css' //e substitua por esse no ambiente dist que no ambiente de producao já esta sendo criado pelo less minificando o css
                        },
                        {
                            match: 'ENDERECO_DO_JS',//eu quero que ele encontre essa palavra e substitua pelo caminho abaixo
                            replacement: './scripts/main.min.js' //apos fazer isso fomos na nossa index e colocamos o caminho @@endereco no href do stylesheet
                        }
                    ]
                },
                files: [
                    {   //aqui mandamos  pegar a index temporaria da prebuild minificada e colocar na pasta dist isso porque no plugin htmlin
                        //mandamos criar outra pasta com outra index que o plugin minifica o html
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'], //aqui pedimos ao ambiente DIST do servidor para pegar a index da temporaria que só é usada para minificar o arquivo
                        dest: 'dist/' //ao pegar a index ele deve replace nela na pasta dist/index.html
                    }
                ]
            }
        },
        htmlmin: { //aqui começamos a minificação do html
            dist: {//dist eu quero essas opções
                options: {
                    removeComments: true, //remover comentários
                    collapseWhitespace: true, //remover espaços
                },
                files: {
                        //destino                origem
                    'prebuild/index.html': 'src/index.html' //criamos a pasta e o index temporaria minificada na prebuild
                }//pegue a origem e coloque la no destino prebuild temporario, onde o replace do ambiente dist vai olhar a index e copiar para o ambiente dist.
            }
        },
        clean: ['prebuild'], //Agora vamos fazer o seguinte vamos organizar as tarefas e colocar o clean para apagar a pasta temporaria.
        uglify: {
            target: { 
            files: {       
            'dist/scripts/main.min.js': 'src/scripts/main.js'
                    }
                    }
        
        }
    })



    grunt.loadNpmTasks('grunt-contrib-less'); //vamos chamar esse plugin aqui
    grunt.loadNpmTasks('grunt-contrib-watch'); //vamos chamar esse plugin aqui
    grunt.loadNpmTasks('grunt-replace'); //vamos chamar esse plugin aqui
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); //vamos chamar esse plugin aqui
    grunt.loadNpmTasks('grunt-contrib-clean'); //vamos chamar esse plugin aqui
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']); //aqui nós só quremos que ele olhe alguns arquivos less e compile de acordo com o que determinamos, e o html que ele olhe o que esta na index na src e faça a tarefa do replace.
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);// agora execute o script de construcao que criamos com todas essas tarefas
    //builds = construção
}

