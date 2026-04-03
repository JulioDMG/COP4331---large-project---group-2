# lispcat's devshell
{
  description = "MERN stack dev environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfreePredicate = pkg:
          builtins.elem (nixpkgs.lib.getName pkg) [ "mongodb" ];
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          nodePackages.nodemon
          bruno
          mongosh
          # mongodb
        ];

        shellHook = ''
          export PATH="$PWD/node_modules/.bin:$PATH"
          # mkdir -p .mongodb/data
          # mongod --dbpath .mongodb/data --fork --logpath .mongodb/mongod.log
          # echo "MongoDB started. Data in .mongodb/data"
          echo "Node $(node --version) | npm $(npm --version)"
        '';
      };
    };
}
