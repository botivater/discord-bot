import sys, getopt, os, shutil
from PIL import Image

class ProcessPictures:
    def __init__(self, argv) -> None:
        self.inputdir = ""
        self.outputdir = ""

        try:
            opts, args = getopt.getopt(argv, "hi:o:", ["idir=", "odir="])
        except getopt.GetoptError:
            print("process-pictures.py -i <inputdir> -o <outputdir>")
            sys.exit(2)
        
        for opt, arg in opts:
            if opt == '-h':
                print("process-pictures.py -i <inputdir> -o <outputdir>")
                sys.exit()
            elif opt in ("-i", "--idir"):
                self.inputdir = arg
            elif opt in ("-o", "--odir"):
                self.outputdir = arg

        if self.inputdir == "" or self.outputdir == "":
            print("Missing options!")
            sys.exit(2)

    def process_files(self):
        index = 0
        errors = 0

        for file in os.listdir(self.inputdir):
            in_filename = f"{self.inputdir}/{file}"
            out_filename = f"{self.outputdir}/{index}.jpg"

            try:
                with Image.open(in_filename) as image:
                    image.convert('RGB').save(out_filename)
                    print(f"Done with {out_filename}")
            except OSError:
                print(f"Cannot convert {in_filename}")
                errors += 1

            index += 1

        print("#" * 60)
        print(f"Processed {index} files and encountered {errors} errors")

if __name__ == "__main__":
    process_pictures = ProcessPictures(sys.argv[1:])
    process_pictures.process_files()
