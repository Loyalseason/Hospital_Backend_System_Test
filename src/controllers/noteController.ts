import { Request, Response } from "express";
import noteService from "../services/noteService";
import ApiResponse, { NotFoundResponse } from "../services/errorResponse";
import { SuccessResponse, BadRequestResponse } from "../services/errorResponse";
import { Role } from "@prisma/client";
import { NoteData } from "../interface/userInterface";

class NoteController {

    async getNote(req: Request, res: Response) {
        try {
          const { id } = req.params;
          if (id) {
            const note = await noteService.find(id);
            if (!note) {
              return new NotFoundResponse("Note not found").send(res);
            }
            return new SuccessResponse("Note retrieved successfully", note).send(res);
          }
          const notes = await noteService.findAll();
          return new SuccessResponse("All notes retrieved successfully", notes).send(res);
        } catch (error) {
          return new BadRequestResponse("Error retrieving notes").send(res);
        }
      }

      public async createNote(req: Request, res: Response) {
        try {
          const { patientId, content } = req.body;
            const { id: userId, role } = req.user;

            if (!content) {
            return new BadRequestResponse("Note content is required").send(res);
        }
        const noteData: Partial<NoteData> = {
            content,
            doctorId: role === Role.DOCTOR ? userId : undefined,
            patientId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

          const newNote = await noteService.create(noteData, role);
    
          return new SuccessResponse("Note created successfully", newNote).send(res);
        } catch (error) {
            console.log(error)
            if (error instanceof ApiResponse) {
                return error.send(res);
              }
          return new BadRequestResponse("An error occurred while creating the note").send(res);
        }
      }
    
      async  updateNote(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const { id: userId, role: userRole } = req.user;
    
            if (!content) {
                return new BadRequestResponse("Content is required").send(res);
            }
    
            const updatedNote = await noteService.update(id, { content }, userId, userRole);
    
            return new SuccessResponse("Note updated successfully", updatedNote).send(res);
        } catch (error) {
            return error instanceof ApiResponse 
                ? error.send(res) 
                : new BadRequestResponse("Error updating note").send(res);
        }
    }
      
}

export default new NoteController();
